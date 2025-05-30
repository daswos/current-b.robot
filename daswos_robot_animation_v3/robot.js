// Daswos Robot Animation using p5.js with advanced image-based animation
// Based on detailed image analysis and animation feature requirements

// Image variables for different robot views
let robotImages = {
  front: null,
  side: null,
  threeQuarter: null,
  back: null,
  top: null
};

// Component-specific images (for potential future use)
let robotParts = {
  head: null,
  body: null,
  arms: {
    left: null,
    right: null
  },
  legs: null
};

// Animation state variables
let robotState = 'idle'; // Current animation state
let previousState = 'idle'; // Previous animation state for transitions
let stateStartTime = 0; // When the current state started
let transitionProgress = 0; // Progress of transition between states (0-1)
let isTransitioning = false; // Whether currently in transition between states

// Position and movement variables
let robotX; // Current X position of robot
let robotY; // Current Y position of robot
let targetX = 0; // Target X position for rolling animation
let targetY = 0; // Target Y position for rolling animation
let isRolling = false; // Whether the robot is currently rolling
let rollDirection = 0; // Direction of rolling in radians
let rollSpeed = 0; // Speed of rolling
let isExitingRight = false; // Whether the robot is exiting to the right
let exitStartTime = 0; // When the exit animation started
let hasExited = false; // Whether the robot has completely exited the screen
let comebackStartTime = 0; // When the comeback animation started
let comebackPhase = 'entering'; // 'entering', 'large', 'shrinking', 'speechBubble', 'complete'

// Animation effect variables
let headRotation = 0; // Rotation of the head relative to body
let headBobAmount = 0; // Amount of head bobbing
let bodyRotation = 0; // Rotation of the body/wheel
let bodyRotationSpeed = 0; // Speed of body rotation
let armLeftRotation = 0; // Rotation of left arm
let armRightRotation = 0; // Rotation of right arm
let legsVisible = true; // Whether legs are currently visible
let legsVisibility = 1; // Opacity of legs (0-1)
let eyeBlinkTime = 0; // Time for eye blinking effect
let isBlinking = false; // Whether eyes are currently blinking
let talkPulse = 0; // Pulsing effect for talking animation
let dancePhase = 0; // Phase of the dance animation
let searchAngle = 0; // Angle for search animation
let thinkingPulse = 0; // Pulsing effect for thinking animation
let respondingGlow = 0; // Glowing effect for responding animation

// View management variables
let currentView = 'front'; // Current view being displayed
let targetView = 'front'; // Target view to transition to
let viewTransitionProgress = 0; // Progress of view transition (0-1)

// Mouse interaction variables
let lastMouseX = 0; // Last mouse X position for interaction
let lastMouseY = 0; // Last mouse Y position for interaction
let mouseInteractionTimer = 0; // Timer for mouse interaction effects

// Mouse hold and spinning variables
let isMousePressed = false; // Whether mouse/touch is currently pressed
let mouseHoldStartTime = 0; // When the mouse press started
let isSpinning = false; // Whether robot is currently spinning
let spinRotation = 0; // Current spin rotation angle
let spinSpeed = 0; // Current spin speed
const HOLD_THRESHOLD = 300; // Time in ms to hold before spinning starts
const MAX_SPIN_SPEED = 0.15; // Maximum spin speed
let canvas; // Canvas element reference for touch events

// Constants
const TRANSITION_DURATION = 500; // Duration of state transitions in ms
const VIEW_TRANSITION_DURATION = 300; // Duration of view transitions in ms
const SHADOW_OPACITY = 0.3; // Opacity of the shadow
const SHADOW_SCALE_Y = 0.2; // Y-scale of the shadow ellipse
const SHADOW_OFFSET_Y = 20; // Y-offset of the shadow from the robot center

// Scale-related variables
let robotScale = 0.5; // Current scale factor for robot images
let targetScale = 0.5; // Target scale for smooth transitions
const MIN_SCALE = 0.01; // Minimum allowed scale (1% - super tiny!)
const MAX_SCALE = 1.5; // Maximum allowed scale
const DEFAULT_SCALE = 0.5; // Default scale value
const SCALE_TRANSITION_SPEED = 0.1; // Speed of scale transitions

// Centering and position variables
let centerX = 0; // Center X position of the screen
let centerY = 0; // Center Y position of the screen
let shouldReturnToCenter = false; // Whether robot should return to center
const POSITION_TRANSITION_SPEED = 0.05; // Speed of position transitions
let danceStartX = 0; // Starting X position for dance (to oscillate around)
let danceStartY = 0; // Starting Y position for dance (to oscillate around)

// Setup function - runs once at the beginning
function setup() {
  // Create canvas that fills the window
  createCanvas(windowWidth, windowHeight);

  // Initialize robot position to center of screen
  centerX = width / 2;
  centerY = height / 2;
  robotX = centerX;
  robotY = centerY;

  // Set up button event listeners
  document.getElementById('idleBtn').addEventListener('click', () => {
    if (!hasExited && robotState !== 'exited') setRobotState('idle');
  });
  document.getElementById('talkBtn').addEventListener('click', () => {
    if (!hasExited && robotState !== 'exited') setRobotState('talk');
  });
  document.getElementById('danceBtn').addEventListener('click', () => {
    if (!hasExited && robotState !== 'exited') setRobotState('dance');
  });
  document.getElementById('rollBtn').addEventListener('click', () => {
    if (!hasExited && robotState !== 'exited') {
      // Roll to a random position on screen
      targetX = random(width * 0.2, width * 0.8);
      targetY = random(height * 0.2, height * 0.8);
      setRobotState('roll');
    }
  });
  document.getElementById('searchBtn').addEventListener('click', () => {
    if (!hasExited && robotState !== 'exited') setRobotState('search');
  });
  document.getElementById('exitRightBtn').addEventListener('click', () => {
    if (!hasExited && robotState !== 'exited') setRobotState('exitRight');
  });
  document.getElementById('comeBackBtn').addEventListener('click', () => {
    // Only allow comeback if robot has actually exited
    if (hasExited || robotState === 'exited') {
      setRobotState('comeBack');
    }
  });
  document.getElementById('centerBtn').addEventListener('click', () => {
    if (!hasExited && robotState !== 'exited') centerRobot();
  });
  document.getElementById('testSpeechBtn').addEventListener('click', () => {
    showSpeechBubble("you made me feel really small");
  });

  // Set up scale control event listeners
  document.getElementById('scaleSlider').addEventListener('input', (e) => {
    setRobotScale(parseFloat(e.target.value));
  });
  document.getElementById('scaleUpBtn').addEventListener('click', () => {
    setRobotScale(Math.min(MAX_SCALE, targetScale + 0.1));
  });
  document.getElementById('scaleDownBtn').addEventListener('click', () => {
    setRobotScale(Math.max(MIN_SCALE, targetScale - 0.1));
  });
  document.getElementById('resetScaleBtn').addEventListener('click', () => {
    setRobotScale(DEFAULT_SCALE);
  });

  // Set up header button event listeners
  document.getElementById('walletBtn').addEventListener('click', () => {
    alert('Wallet functionality coming soon! 💳');
    setRobotState('dance');
  });

  document.getElementById('sellBtn').addEventListener('click', () => {
    alert('Sell functionality coming soon! 🏪');
    setRobotState('search');
  });

  document.getElementById('cartBtn').addEventListener('click', () => {
    alert('Cart functionality coming soon! 🛒');
    setRobotState('roll');
  });

  document.getElementById('signInBtn').addEventListener('click', () => {
    alert('Sign in functionality coming soon! 👤');
    setRobotState('talk');
  });

  // Add touch event support for mobile devices
  canvas = document.querySelector('canvas');
  if (canvas) {
    canvas.addEventListener('touchstart', (e) => {
      e.preventDefault();
      mousePressed();
    });
    canvas.addEventListener('touchend', (e) => {
      e.preventDefault();
      mouseReleased();
    });
  }

  // Hide loading message once setup is complete
  document.getElementById('loading').style.display = 'none';

  // Initial entrance animation
  robotX = -100; // Start off-screen
  targetX = centerX;
  targetY = centerY;
  setRobotState('roll');

  // Initialize button states
  updateButtonStates();
}

// Preload function - loads assets before setup
function preload() {
  // Load all robot view images
  robotImages.front = loadImage('images/robot_front_view.png');
  robotImages.side = loadImage('images/robot_side_view.png');
  robotImages.threeQuarter = loadImage('images/robot_three_quarter_view.png');
  robotImages.back = loadImage('images/robot_back_view.png');
  robotImages.top = loadImage('images/robot_top_view.png');
}

// Draw function - runs every frame
function draw() {
  // Clear background
  background('#f0f0f0');

  // Update animation based on current state
  updateAnimation();

  // Draw robot
  drawRobot();

  // Update speech bubble position if visible
  updateSpeechBubblePosition();

  // Handle mouse interaction
  handleMouseInteraction();
}

// Update animation based on current state
function updateAnimation() {
  // Calculate time in current state
  let currentTime = millis();
  let timeInState = currentTime - stateStartTime;

  // Handle smooth scale transitions
  if (abs(robotScale - targetScale) > 0.01) {
    robotScale = lerp(robotScale, targetScale, SCALE_TRANSITION_SPEED);
  } else {
    robotScale = targetScale;
  }

  // Handle smooth return to center when needed
  if (shouldReturnToCenter && !isRolling) {
    let distanceToCenter = dist(robotX, robotY, centerX, centerY);
    if (distanceToCenter > 2) {
      robotX = lerp(robotX, centerX, POSITION_TRANSITION_SPEED);
      robotY = lerp(robotY, centerY, POSITION_TRANSITION_SPEED);
    } else {
      robotX = centerX;
      robotY = centerY;
      shouldReturnToCenter = false;
    }
  }

  // Handle mouse hold spinning
  if (isMousePressed) {
    let holdDuration = currentTime - mouseHoldStartTime;
    if (holdDuration > HOLD_THRESHOLD && !isSpinning) {
      // Start spinning
      isSpinning = true;
      spinSpeed = 0;
    }

    if (isSpinning) {
      // Gradually increase spin speed
      spinSpeed = min(spinSpeed + 0.005, MAX_SPIN_SPEED);
      spinRotation += spinSpeed;
    }
  } else if (isSpinning) {
    // Gradually slow down spinning when mouse is released
    spinSpeed = max(spinSpeed - 0.01, 0);
    spinRotation += spinSpeed;

    if (spinSpeed <= 0) {
      isSpinning = false;
      spinRotation = 0; // Reset rotation when stopped
    }
  }

  // Handle rolling movement if needed
  if (isRolling) {
    // Calculate direction to target
    let dx = targetX - robotX;
    let dy = targetY - robotY;
    let distance = sqrt(dx*dx + dy*dy);

    // If we're close enough to target, stop rolling
    if (distance < 5) {
      isRolling = false;
      if (robotState === 'roll') {
        setRobotState('idle');
      }
    } else {
      // Update position and rotation
      rollDirection = atan2(dy, dx);
      rollSpeed = min(distance * 0.05, 5);
      robotX += cos(rollDirection) * rollSpeed;
      robotY += sin(rollDirection) * rollSpeed;

      // Rotate body based on movement (wheel rotation)
      bodyRotationSpeed = rollSpeed * 0.2;
      bodyRotation += bodyRotationSpeed;

      // Set appropriate view based on roll direction
      if (abs(cos(rollDirection)) > abs(sin(rollDirection))) {
        // Moving more horizontally
        targetView = cos(rollDirection) > 0 ? 'side' : 'side';
      } else {
        // Moving more vertically
        targetView = sin(rollDirection) > 0 ? 'threeQuarter' : 'back';
      }

      // Hide legs during rolling
      legsVisible = false;
      legsVisibility = max(0, legsVisibility - 0.1);
    }
  } else if (robotState !== 'roll' && !legsVisible) {
    // Show legs when not rolling
    legsVisible = true;
    legsVisibility = min(1, legsVisibility + 0.05);
  }

  // Handle view transitions
  if (currentView !== targetView) {
    viewTransitionProgress = min(1, timeInState / VIEW_TRANSITION_DURATION);
    if (viewTransitionProgress >= 1) {
      currentView = targetView;
      viewTransitionProgress = 0;
    }
  }

  // State-specific updates
  switch (robotState) {
    case 'idle':
      // Subtle bobbing motion
      headBobAmount = sin(currentTime * 0.002) * 5;

      // Occasional head rotation
      headRotation = sin(currentTime * 0.001) * 0.1;

      // Subtle arm movements
      armLeftRotation = sin(currentTime * 0.001) * 0.05;
      armRightRotation = sin(currentTime * 0.001 + PI) * 0.05;

      // Occasional eye blink
      if (currentTime > eyeBlinkTime && !isBlinking) {
        isBlinking = true;
        eyeBlinkTime = currentTime + 200; // Blink duration
      } else if (currentTime > eyeBlinkTime && isBlinking) {
        isBlinking = false;
        eyeBlinkTime = currentTime + random(2000, 5000); // Time until next blink
      }

      // Default to front view in idle
      if (!isRolling) targetView = 'front';

      // Ensure legs are visible
      legsVisible = true;
      legsVisibility = min(1, legsVisibility + 0.05);
      break;

    case 'talk':
      // Pulsing head effect
      talkPulse = sin(currentTime * 0.01) * 0.05;

      // Head bobbing synchronized with "speech"
      headBobAmount = sin(currentTime * 0.01) * 3;

      // Arm gestures synchronized with talking
      armLeftRotation = sin(currentTime * 0.008) * 0.2;
      armRightRotation = sin(currentTime * 0.008 + PI) * 0.2;

      // Always use front view when talking
      targetView = 'front';

      // Ensure legs are visible
      legsVisible = true;
      legsVisibility = min(1, legsVisibility + 0.05);
      break;

    case 'dance':
      // Update dance phase with faster rhythm for breakdancing
      dancePhase += 0.08;

      // Breakdance sequence - different moves based on time
      let breakdanceMove = floor((timeInState / 1500) % 6); // 6 different moves, 1.5 seconds each

      switch (breakdanceMove) {
        case 0: // Head spin
          headBobAmount = sin(dancePhase * 4) * 15;
          headRotation = sin(dancePhase * 3) * 0.5;
          armLeftRotation = sin(dancePhase * 2) * 0.8;
          armRightRotation = sin(dancePhase * 2 + PI) * 0.8;
          // Rapid side-to-side movement
          if (!isRolling) {
            robotX = danceStartX + sin(dancePhase * 3) * 20;
            robotY = danceStartY + sin(dancePhase * 2) * 8;
          }
          targetView = 'front';
          break;

        case 1: // Windmill arms
          headBobAmount = sin(dancePhase * 2) * 10;
          headRotation = sin(dancePhase * 0.5) * 0.3;
          // Windmill arm rotation
          armLeftRotation = (dancePhase * 2) % (PI * 2);
          armRightRotation = (dancePhase * 2 + PI) % (PI * 2);
          // Bounce movement
          if (!isRolling) {
            robotX = danceStartX + sin(dancePhase) * 15;
            robotY = danceStartY + abs(sin(dancePhase * 2)) * 12;
          }
          targetView = 'threeQuarter';
          break;

        case 2: // Freeze pose
          headBobAmount = sin(dancePhase * 6) * 5;
          headRotation = 0.4; // Tilted head
          armLeftRotation = 1.2; // Extended pose
          armRightRotation = -0.8; // Different angle
          // Hold position with slight vibration
          if (!isRolling) {
            robotX = danceStartX + sin(dancePhase * 8) * 3;
            robotY = danceStartY + sin(dancePhase * 10) * 2;
          }
          targetView = 'side';
          break;

        case 3: // Leg work (footwork)
          headBobAmount = sin(dancePhase * 3) * 12;
          headRotation = sin(dancePhase * 2) * 0.25;
          armLeftRotation = sin(dancePhase * 1.5) * 0.6;
          armRightRotation = sin(dancePhase * 1.5 + PI/2) * 0.6;
          // Quick leg movements (simulated by rapid Y movement)
          if (!isRolling) {
            robotX = danceStartX + sin(dancePhase * 4) * 25;
            robotY = danceStartY + sin(dancePhase * 6) * 15;
          }
          // Rapid leg visibility changes to simulate footwork
          legsVisibility = 0.3 + sin(dancePhase * 8) * 0.7;
          targetView = 'front';
          break;

        case 4: // Power move (spinning)
          headBobAmount = sin(dancePhase * 5) * 8;
          headRotation = sin(dancePhase * 4) * 0.4;
          // Rapid arm movements
          armLeftRotation = sin(dancePhase * 6) * 1.2;
          armRightRotation = sin(dancePhase * 6 + PI/3) * 1.2;
          // Circular movement
          if (!isRolling) {
            robotX = danceStartX + cos(dancePhase * 2) * 30;
            robotY = danceStartY + sin(dancePhase * 2) * 20;
          }
          targetView = 'threeQuarter';
          break;

        case 5: // Top rock (standing moves)
          headBobAmount = sin(dancePhase * 2.5) * 18;
          headRotation = sin(dancePhase * 1.5) * 0.35;
          // Alternating arm pumps
          armLeftRotation = sin(dancePhase * 3) * 0.9;
          armRightRotation = sin(dancePhase * 3 + PI) * 0.9;
          // Strong vertical bounce
          if (!isRolling) {
            robotX = danceStartX + sin(dancePhase * 1.5) * 12;
            robotY = danceStartY + abs(sin(dancePhase * 3)) * 20;
          }
          targetView = 'front';
          break;
      }

      // Ensure legs are visible (except during footwork move)
      if (breakdanceMove !== 3) {
        legsVisible = true;
        legsVisibility = min(1, legsVisibility + 0.05);
      }
      break;

    case 'search':
      // Update search angle
      searchAngle += 0.03;

      // Head rotation for searching
      headRotation = sin(searchAngle) * 0.3;

      // Subtle body movement
      headBobAmount = sin(currentTime * 0.005) * 3;

      // Arm movements for searching/pointing
      armLeftRotation = sin(searchAngle * 0.5) * 0.2;
      armRightRotation = sin(searchAngle * 0.5 + PI) * 0.2;

      // Cycle through views for searching
      if (timeInState % 3000 < 1000) {
        targetView = 'front';
      } else if (timeInState % 3000 < 2000) {
        targetView = 'threeQuarter';
      } else {
        targetView = 'side';
      }

      // Ensure legs are visible
      legsVisible = true;
      legsVisibility = min(1, legsVisibility + 0.05);
      break;

    case 'roll':
      // Most updates handled in the rolling logic above

      // Add some head bobbing during roll
      headBobAmount = sin(currentTime * 0.01) * 3;

      // Slight arm movement based on speed
      armLeftRotation = sin(currentTime * 0.01) * 0.1 * (rollSpeed * 0.1);
      armRightRotation = sin(currentTime * 0.01 + PI) * 0.1 * (rollSpeed * 0.1);

      // Hide legs during rolling
      legsVisible = false;
      legsVisibility = max(0, legsVisibility - 0.1);
      break;

    case 'exitRight':
      // Handle exit to right animation
      if (!isExitingRight) {
        isExitingRight = true;
        exitStartTime = currentTime;
        // Set target far off the right side of screen
        targetX = width + 200;
        targetY = robotY; // Keep same Y position
        isRolling = true;
      }

      // Continuous rolling motion to the right
      rollDirection = 0; // Moving right (0 radians)
      rollSpeed = 8; // Fast exit speed
      robotX += rollSpeed;

      // Rotate body based on movement (wheel rotation)
      bodyRotationSpeed = rollSpeed * 0.2;
      bodyRotation += bodyRotationSpeed;

      // Use side view for exit animation
      targetView = 'side';

      // Hide legs during rolling
      legsVisible = false;
      legsVisibility = max(0, legsVisibility - 0.1);

      // Check if robot has exited the screen
      if (robotX > width + 100) {
        // Robot has disappeared off screen, stop the animation
        hasExited = true;
        isExitingRight = false;
        isRolling = false;
        setRobotState('exited'); // Set to a new "exited" state
      }

      // Add some head bobbing during exit
      headBobAmount = sin(currentTime * 0.01) * 3;

      // Slight arm movement based on speed
      armLeftRotation = sin(currentTime * 0.01) * 0.1;
      armRightRotation = sin(currentTime * 0.01 + PI) * 0.1;
      break;

    case 'thinking':
      // Pulsing head effect for thinking
      thinkingPulse = sin(currentTime * 0.008) * 0.08;

      // Subtle head rotation while thinking
      headRotation = sin(currentTime * 0.003) * 0.15;

      // Gentle bobbing
      headBobAmount = sin(currentTime * 0.004) * 4;

      // Minimal arm movement
      armLeftRotation = sin(currentTime * 0.002) * 0.03;
      armRightRotation = sin(currentTime * 0.002 + PI) * 0.03;

      // Always use front view when thinking
      targetView = 'front';

      // Ensure legs are visible
      legsVisible = true;
      legsVisibility = min(1, legsVisibility + 0.05);
      break;

    case 'responding':
      // Glowing effect for responding
      respondingGlow = sin(currentTime * 0.01) * 0.1;

      // More active head bobbing
      headBobAmount = sin(currentTime * 0.008) * 6;

      // Active arm gestures
      armLeftRotation = sin(currentTime * 0.01) * 0.25;
      armRightRotation = sin(currentTime * 0.01 + PI) * 0.25;

      // Slight head rotation
      headRotation = sin(currentTime * 0.005) * 0.1;

      // Always use front view when responding
      targetView = 'front';

      // Ensure legs are visible
      legsVisible = true;
      legsVisibility = min(1, legsVisibility + 0.05);
      break;

    case 'exited':
      // Robot is off-screen, do nothing (invisible state)
      // Keep robot position off-screen
      robotX = width + 200;
      break;

    case 'comeBack':
      // Robot is coming back from the right side
      if (!isRolling && (hasExited || robotState === 'exited')) {
        // Start the comeback animation only if robot was actually exited
        robotX = width + 100; // Start off right side
        targetX = centerX; // Target center
        targetY = centerY;
        isRolling = true;
        hasExited = false;
        comebackStartTime = currentTime;
        comebackPhase = 'entering';
        // Set to large size for dramatic entrance
        setRobotScale(1.5);
      }

      let comebackTime = currentTime - comebackStartTime;

      // Handle different phases of comeback
      if (comebackPhase === 'entering') {
        // Calculate direction to target (coming from right)
        let dx = targetX - robotX;
        let dy = targetY - robotY;
        let distance = sqrt(dx*dx + dy*dy);

        // If we're close enough to target, stop rolling and enter large phase
        if (distance < 5) {
          isRolling = false;
          comebackPhase = 'large';
          comebackStartTime = currentTime; // Reset timer for large phase
          robotX = targetX;
          robotY = targetY;
        } else {
          // Update position and rotation (moving left)
          rollDirection = atan2(dy, dx);
          rollSpeed = min(distance * 0.05, 5);
          robotX += cos(rollDirection) * rollSpeed;
          robotY += sin(rollDirection) * rollSpeed;

          // Rotate body based on movement (wheel rotation)
          bodyRotationSpeed = rollSpeed * 0.2;
          bodyRotation += bodyRotationSpeed;

          // Hide legs during rolling
          legsVisible = false;
          legsVisibility = max(0, legsVisibility - 0.1);
        }

        // Use side view for comeback, but flipped since moving left
        targetView = 'side';

        // Add some head bobbing during comeback
        headBobAmount = sin(currentTime * 0.01) * 3;

        // Slight arm movement based on speed
        armLeftRotation = sin(currentTime * 0.01) * 0.1;
        armRightRotation = sin(currentTime * 0.01 + PI) * 0.1;

      } else if (comebackPhase === 'large') {
        // Stay large for 3 seconds
        if (comebackTime > 3000) {
          comebackPhase = 'shrinking';
          comebackStartTime = currentTime; // Reset timer for shrinking phase
        }

        // Switch to front view and show legs
        targetView = 'front';
        legsVisible = true;
        legsVisibility = min(1, legsVisibility + 0.05);

        // Slight celebratory movement while large
        headBobAmount = sin(currentTime * 0.005) * 5;
        armLeftRotation = sin(currentTime * 0.003) * 0.2;
        armRightRotation = sin(currentTime * 0.003 + PI) * 0.2;

      } else if (comebackPhase === 'shrinking') {
        // Shrink from 150% to 2% over 2 seconds - super tiny!
        let shrinkProgress = min(comebackTime / 2000, 1); // 2 seconds to shrink
        let currentScale = lerp(1.5, 0.02, shrinkProgress);
        setRobotScale(currentScale);

        if (shrinkProgress >= 1) {
          comebackPhase = 'speechBubble';
          comebackStartTime = currentTime; // Reset timer for speech bubble phase
          showSpeechBubble("you made me feel really small");
        }

        // Continue front view and leg visibility
        targetView = 'front';
        legsVisible = true;
        legsVisibility = min(1, legsVisibility + 0.05);

        // Gentle movement during shrinking
        headBobAmount = sin(currentTime * 0.008) * 3;
        armLeftRotation = sin(currentTime * 0.004) * 0.15;
        armRightRotation = sin(currentTime * 0.004 + PI) * 0.15;

      } else if (comebackPhase === 'speechBubble') {
        // Stay at 2% size and show speech bubble for 4 seconds
        if (comebackTime > 4000) {
          comebackPhase = 'complete';
          hideSpeechBubble();
          setRobotState('idle');
        }

        // Keep front view and leg visibility
        targetView = 'front';
        legsVisible = true;
        legsVisibility = min(1, legsVisibility + 0.05);

        // Gentle sad movement while showing speech bubble
        headBobAmount = sin(currentTime * 0.003) * 2; // Slower, smaller movement
        armLeftRotation = sin(currentTime * 0.002) * 0.1;
        armRightRotation = sin(currentTime * 0.002 + PI) * 0.1;
      }
      break;
  }
}

// Draw the robot based on current state and view
function drawRobot() {
  // Don't draw robot if it has exited
  if (robotState === 'exited') {
    return;
  }

  push();
  translate(robotX, robotY);

  // Draw shadow
  drawShadow();

  // Apply bobbing effect
  translate(0, headBobAmount);

  // Scale the robot
  scale(robotScale);

  // Apply horizontal flip if coming back (moving left)
  if (robotState === 'comeBack') {
    scale(-1, 1); // Flip horizontally
  }

  // Apply spin rotation if spinning
  if (isSpinning || spinSpeed > 0) {
    rotate(spinRotation);
  }

  // Apply body rotation for wheel effect
  if (robotState === 'roll') {
    push();
    rotate(bodyRotation);
  }

  // Determine which image to draw based on current view and transition
  let currentImage = robotImages[currentView];

  // If transitioning between views, blend them
  if (currentView !== targetView && viewTransitionProgress > 0) {
    // Draw current view with fading opacity
    tint(255, 255, 255, 255 * (1 - viewTransitionProgress));
    image(currentImage, -currentImage.width/2, -currentImage.height/2);

    // Draw target view with increasing opacity
    tint(255, 255, 255, 255 * viewTransitionProgress);
    let targetImage = robotImages[targetView];
    image(targetImage, -targetImage.width/2, -targetImage.height/2);

    // Reset tint
    noTint();
  } else {
    // Apply effects based on state
    if (robotState === 'talk') {
      // Subtle pulsing for talking
      scale(1 + talkPulse);
    } else if (robotState === 'thinking') {
      // Pulsing effect for thinking
      scale(1 + thinkingPulse);
      // Add slight blue tint for thinking
      tint(200, 220, 255);
    } else if (robotState === 'responding') {
      // Glowing effect for responding
      scale(1 + respondingGlow);
      // Add slight green tint for responding
      tint(220, 255, 220);
    } else if (robotState === 'dance') {
      // Special effects for breakdancing
      let breakdanceMove = floor(((millis() - stateStartTime) / 1500) % 6);
      if (breakdanceMove === 4) { // Power move
        // Pulsing effect during power moves
        let powerPulse = sin(millis() * 0.02) * 0.05;
        scale(1 + powerPulse);
        // Add energetic color tint
        tint(255, 200, 255); // Purple tint for power moves
      } else if (breakdanceMove === 1) { // Windmill
        // Slight scaling for windmill
        let windmillPulse = sin(millis() * 0.015) * 0.03;
        scale(1 + windmillPulse);
        tint(200, 255, 255); // Cyan tint for windmill
      }
    }

    // Draw the current view
    image(currentImage, -currentImage.width/2, -currentImage.height/2);

    // Reset tint if it was applied
    if (robotState === 'thinking' || robotState === 'responding' || robotState === 'dance') {
      noTint();
    }
  }

  if (robotState === 'roll') {
    pop(); // End body rotation
  }

  pop();
}

// Draw shadow beneath the robot
function drawShadow() {
  push();
  translate(0, SHADOW_OFFSET_Y);
  fill(0, 0, 0, SHADOW_OPACITY * 255);
  noStroke();
  ellipse(0, 0, 120 * robotScale, 30 * robotScale * SHADOW_SCALE_Y);
  pop();
}

// Handle mouse interaction with the robot
function handleMouseInteraction() {
  // Don't handle mouse interaction if robot has exited
  if (hasExited || robotState === 'exited') {
    return;
  }

  // Calculate distance from mouse to robot
  let d = dist(mouseX, mouseY, robotX, robotY);

  // If mouse is near robot and moving (scale interaction range with robot size)
  if (d < 150 * robotScale && (abs(mouseX - lastMouseX) > 5 || abs(mouseY - lastMouseY) > 5)) {
    // Make robot look toward mouse
    let angle = atan2(mouseY - robotY, mouseX - robotX);
    headRotation = lerp(headRotation, angle * 0.2, 0.1);

    // Set appropriate view based on mouse position
    if (abs(cos(angle)) > 0.7) {
      // Mouse is more to the sides
      targetView = cos(angle) > 0 ? 'threeQuarter' : 'threeQuarter';
    } else {
      // Mouse is more above/below
      targetView = sin(angle) > 0 ? 'front' : 'top';
    }

    // Reset interaction timer
    mouseInteractionTimer = millis() + 1000;
  }

  // If interaction timer expired, return to default view for current state
  if (mouseInteractionTimer > 0 && millis() > mouseInteractionTimer) {
    mouseInteractionTimer = 0;
    // Return to default view for current state
    switch (robotState) {
      case 'idle':
        targetView = 'front';
        break;
      case 'talk':
        targetView = 'front';
        break;
      case 'dance':
        // Keep current view for dance
        break;
      case 'search':
        // Keep current view for search
        break;
      case 'roll':
        // Keep current view for roll
        break;
      case 'exitRight':
        // Keep side view for exit
        break;
      case 'exited':
        // Robot is off-screen, no view changes
        break;
      case 'comeBack':
        // Keep side view for comeback
        break;
    }
  }

  // Store current mouse position for next frame
  lastMouseX = mouseX;
  lastMouseY = mouseY;
}

// Update button states based on robot state
function updateButtonStates() {
  const comeBackBtn = document.getElementById('comeBackBtn');
  const exitRightBtn = document.getElementById('exitRightBtn');
  const idleBtn = document.getElementById('idleBtn');
  const talkBtn = document.getElementById('talkBtn');
  const danceBtn = document.getElementById('danceBtn');
  const rollBtn = document.getElementById('rollBtn');
  const searchBtn = document.getElementById('searchBtn');
  const centerBtn = document.getElementById('centerBtn');

  const robotHasExited = hasExited || robotState === 'exited';

  if (comeBackBtn) {
    // Enable "Come Back" only if robot has exited
    comeBackBtn.disabled = !robotHasExited;
  }

  if (exitRightBtn) {
    // Disable "Exit Right" if robot is already exiting or has exited
    exitRightBtn.disabled = (robotState === 'exitRight' || robotHasExited || isExitingRight);
  }

  // Disable all other robot control buttons when robot has exited
  const otherButtons = [idleBtn, talkBtn, danceBtn, rollBtn, searchBtn, centerBtn];
  otherButtons.forEach(btn => {
    if (btn) {
      btn.disabled = robotHasExited;
    }
  });
}

// Set the robot's animation state
function setRobotState(state) {
  // Store previous state for transitions
  previousState = robotState;
  robotState = state;

  // Record start time for this state
  stateStartTime = millis();

  // Hide speech bubble when changing states (except for comeBack which handles it separately)
  if (state !== 'comeBack') {
    hideSpeechBubble();
  }

  // Reset state-specific variables
  switch (state) {
    case 'idle':
      if (!isRolling) {
        targetView = 'front';
      }
      break;

    case 'talk':
      targetView = 'front';
      talkPulse = 0;
      break;

    case 'dance':
      dancePhase = 0;
      // Set dance start position to current robot position
      danceStartX = robotX;
      danceStartY = robotY;
      break;

    case 'search':
      searchAngle = 0;
      break;

    case 'roll':
      isRolling = true;
      // Hide legs immediately when starting to roll
      legsVisible = false;
      break;

    case 'exitRight':
      // Reset exit state variables
      isExitingRight = false;
      exitStartTime = 0;
      // Will be set to true in updateAnimation
      break;

    case 'thinking':
      targetView = 'front';
      thinkingPulse = 0;
      break;

    case 'responding':
      targetView = 'front';
      respondingGlow = 0;
      break;

    case 'exited':
      // Robot is off-screen, no special setup needed
      break;

    case 'comeBack':
      // Only allow comeback if robot has actually exited
      if (hasExited || previousState === 'exited') {
        // Reset comeback state variables
        isRolling = false;
        comebackStartTime = 0;
        comebackPhase = 'entering';
        // Hide any existing speech bubble
        hideSpeechBubble();
        // hasExited will be set to false in updateAnimation when rolling starts
        // Animation will start in updateAnimation
      } else {
        // If robot hasn't exited, don't allow comeback - return to previous state
        robotState = previousState;
      }
      break;
  }

  // Update button states after state change
  updateButtonStates();
}

// Handle mouse clicks
function mousePressed() {
  // Don't handle mouse press if robot has exited
  if (hasExited || robotState === 'exited') {
    return;
  }

  isMousePressed = true;
  mouseHoldStartTime = millis();

  // Store the initial click behavior for when mouse is released quickly
  let d = dist(mouseX, mouseY, robotX, robotY);
  if (d < 100 * robotScale) {
    // Quick reaction animation (will trigger if not held long enough)
    setTimeout(() => {
      if (!isSpinning && !isMousePressed) {
        headBobAmount = -10;
        setTimeout(() => { headBobAmount = 0; }, 300);
      }
    }, HOLD_THRESHOLD + 50);
  }
}

// Handle mouse release
function mouseReleased() {
  let holdDuration = millis() - mouseHoldStartTime;
  isMousePressed = false;

  // Don't allow mouse clicks to move robot if it has exited
  if (hasExited || robotState === 'exited') {
    return; // Robot is off-screen, ignore mouse clicks
  }

  // If it was a quick click (not a hold), handle normal click behavior
  if (holdDuration < HOLD_THRESHOLD && !isSpinning) {
    let d = dist(mouseX, mouseY, robotX, robotY);
    if (d >= 100 * robotScale) {
      // Roll to where user clicked
      targetX = mouseX;
      targetY = mouseY;
      setRobotState('roll');
    }
  }
}

// Handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);

  // Update center position for the center button
  centerX = width / 2;
  centerY = height / 2;
}

// Set robot scale with bounds checking and UI updates
function setRobotScale(newScale) {
  // Clamp the scale to valid range
  targetScale = constrain(newScale, MIN_SCALE, MAX_SCALE);

  // Update UI elements
  updateScaleDisplay();
}

// Update the scale display elements
function updateScaleDisplay() {
  const scaleSlider = document.getElementById('scaleSlider');
  const scaleValue = document.getElementById('scaleValue');

  if (scaleSlider && scaleValue) {
    scaleSlider.value = targetScale;
    scaleValue.textContent = Math.round(targetScale * 100) + '%';
  }
}

// Center the robot smoothly
function centerRobot() {
  shouldReturnToCenter = true;

  // If dancing, update the dance start position to center
  if (robotState === 'dance') {
    danceStartX = centerX;
    danceStartY = centerY;
  }
}

// Show speech bubble with custom message
function showSpeechBubble(message) {
  // Create speech bubble element if it doesn't exist
  let speechBubble = document.getElementById('robotSpeechBubble');
  if (!speechBubble) {
    speechBubble = document.createElement('div');
    speechBubble.id = 'robotSpeechBubble';
    speechBubble.className = 'robot-speech-bubble';
    document.body.appendChild(speechBubble);
  }

  // Set the message
  speechBubble.textContent = message;

  // Position the speech bubble near the robot
  updateSpeechBubblePosition();

  // Show the speech bubble
  speechBubble.style.display = 'block';
  speechBubble.style.opacity = '0';

  // Fade in animation
  setTimeout(() => {
    speechBubble.style.opacity = '1';
  }, 50);
}

// Hide speech bubble
function hideSpeechBubble() {
  const speechBubble = document.getElementById('robotSpeechBubble');
  if (speechBubble) {
    speechBubble.style.opacity = '0';
    setTimeout(() => {
      speechBubble.style.display = 'none';
    }, 300);
  }
}

// Update speech bubble position relative to robot
function updateSpeechBubblePosition() {
  const speechBubble = document.getElementById('robotSpeechBubble');
  if (speechBubble && speechBubble.style.display !== 'none') {
    // When robot is tiny, position bubble closer to center for visibility
    let bubbleX, bubbleY;

    if (robotScale < 0.1) {
      // Robot is very small, position bubble in a more visible location
      bubbleX = robotX + 150;
      bubbleY = robotY - 80;

      // Make sure bubble stays on screen
      if (bubbleX > window.innerWidth - 250) bubbleX = robotX - 150;
      if (bubbleY < 100) bubbleY = robotY + 80;
    } else {
      // Normal positioning for larger robot
      bubbleX = robotX + 100;
      bubbleY = robotY - 100;
    }

    speechBubble.style.left = bubbleX + 'px';
    speechBubble.style.top = bubbleY + 'px';
  }
}
