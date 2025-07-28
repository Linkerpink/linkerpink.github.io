// Helper to format date as 'Month Year' or 'Not Released'
function formatDisplayDate(date: string): string {
  if (date.toLowerCase() === "not released") return "Not Released";
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;
  return d.toLocaleString("default", { month: "long", year: "numeric" });
}

// Helper to create slugs from titles
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// The full project list with generated slugs
export const allProjects = [
  // Robo Rebellion: Dawn of the Machine //
  {
    title: "Robo Rebellion: Dawn of the Machine",
    slug: "robo-rebellion-dawn-of-the-machine",
    banner: "/images/robo rebellion.png",
    icon: "/images/robo rebellion icon.webp",
    date: "2024-07-10",
    displayDate: formatDisplayDate("2024-07-10"),
    platform: "Itch.io",
    description:
      "Robo Rebellion Dawn of the Machine, is a top down TwinStick game made by a team of 6 people. 3 Artists and 3 Developers, the game was made as a school project within a short timespan of 4 weeks with it's end goal being a sci-fi based top down shooter.\n\nFEATURES\n\nThe game build supports both QWERTY keyboards and controller. Realistic gun bass! Trigger warning. (Headphone users be warned.) \n\nthe player was made with multiple people, so I will only be showing the parts I made, and are also interesting. \n\nWhat I made: \n- Player Movement, dashing and rotation \n- Player Interaction \n- Pickups \n- Keycards & inventory \n- Keycard stacking UI \n- Weapon switching \n- Player Camera, camera switching and screenshake \n- GameManager, rumble and game state management \n- Tutorial popups \n- Main Menu camera switching \n- Weapon, Ammo & Health UI",

    href: "https://lulaobobao.itch.io/robo-rebellion-dawn-of-the-machine",
    github: "https://github.com/GLU-Gaming/twinstick-2024-arcane-interactive",

    technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

    media: [
      { type: "image", src: "/images/robo rebellion.png" },
      { type: "image", src: "/images/robo rebellion 2.png" },
      { type: "image", src: "/images/robo rebellion 1.webp" },
      { type: "image", src: "/images/robo rebellion 6.jpeg" },
      { type: "image", src: "/images/robo rebellion 4.jpeg" },
      { type: "image", src: "/images/robo rebellion 3.jpeg" },
      { type: "youtubeId", src: "pjqwkHgBgVQ", title: "Launch Trailer" },
    ],

    featured: true,

    codeSnippets: [
      {
        name: "Player.cs",
        language: "C#",
        description:
          "Here are some functions I made for the player. I was in control of the player movement, controller support, animation switching, state switching, player rotation / look at and dashing",
        code: `
public enum PlayerState
{
    Idle,
    Move,
    Dash,
    Dead
}

public PlayerState state;

private void Awake()
{
    //Input
    controls = new Controls();

    controls.Player.Movement.performed += context => MoveInput(context.ReadValue<Vector2>());
    controls.Player.Movement.canceled += context => state = PlayerState.Idle;
    
    controls.Player.Dash.performed += context => DashInput();

    input = GetComponent<PlayerInput>();

    //Animations / model swaps
    robotSwordSlash = GameObject.Find("P_RobotSwordSlash");
    robotRifleRun = GameObject.Find("P_RobotRifleRun");
    robotRifleIdle = GameObject.Find("P_RobotRifleIdle");
}

private void MoveInput(Vector2 direction)
{
    if (state != PlayerState.Dash)
    {
        state = PlayerState.Move;
        moveDirection = new Vector3(direction.x, 0f, direction.y);
    }     
}

private void DashInput()
{
    
    if (canDash && state != PlayerState.Dash)
    {
        state = PlayerState.Dash;
        audioSource.PlayOneShot(dashClip, 1);
        dashTimer = 0f;
        dashDirection = lastMoveDirection;
        dashCoolDown = initialDashCoolDown;
    }

}

private void Start()
{
    //States
    state = PlayerState.Idle;

    //Dash
    initialDashStrength = dashStrength;
    initialDashCoolDown = dashCoolDown;
    dashTrail.SetActive(false);

    //Camera
    cameraManager = FindObjectOfType<CameraManager>();

    //Animations / model swaps
    robotSwordSlash.SetActive(false);
    robotRifleRun.SetActive(false);
    robotRifleIdle.SetActive(false);
}

private void Update()
{
    if (!gameManager.gamePaused)
    {
        switch (state)
        {
            case PlayerState.Idle:
                IdleState();
                break;
            case PlayerState.Move:
                MoveState();
                break;
            case PlayerState.Dash:
                DashState();
                break;
            case PlayerState.Dead:
                DeadState();
                break;
        }

        if (state != PlayerState.Dead)
        {
            if (moveDirection != Vector3.zero)
            {
                lastMoveDirection = moveDirection;
                dashDirection = lastMoveDirection;
            }

            //Input
            aim = controls.Player.Aim.ReadValue<Vector2>();

            RotatePlayer();

            if (Input.GetKeyDown(KeyCode.Space))
            {
                //cameraManager.ScreenShake(10f, 2f, 0.2f);
            }

            if (dashCoolDown > 0f)
            {
                dashCoolDown -= Time.deltaTime;
                canDash = false;
            }
            else
            {
                canDash = true;
            }
        }

        //Debug
        //if (Input.GetKeyDown(KeyCode.B)) enableDebugText = !enableDebugText;
    }        
}

private void FixedUpdate()
{
    if (state != PlayerState.Dash)
    {
        rb.velocity = moveDirection * moveSpeed;
    }
}

private void IdleState()
{
    moveDirection = Vector3.zero;

    if (!melee.isPerformingMelee)
    {
        //Animations / model swaps
        robotSwordSlash.SetActive(false);
        robotRifleRun.SetActive(false);
        robotRifleIdle.SetActive(true);
    }
    
}

private void MoveState()
{
    if (moveDirection == Vector3.zero) 
    {
        state = PlayerState.Idle;
    }

    if (!melee.isPerformingMelee)
    {
        //Animations / model swaps
        robotSwordSlash.SetActive(false);
        robotRifleRun.SetActive(true);
        robotRifleIdle.SetActive(false);
    }
}

private void DashState()
{
    dashTrail.SetActive(true);
    dashStrength = initialDashStrength;

    float dashDistance = dashStrength * dashDuration;

    LayerMask layerMask = LayerMask.GetMask("environmentLayer");

    RaycastHit hit;

    if (Physics.Raycast(transform.position, dashDirection, out hit, 2f, layerMask))
    {
        rb.position = hit.point - dashDirection * 0.1f;
        state = PlayerState.Move;
        dashTrail.SetActive(false);
        return;
    }

    rb.velocity = dashDirection * dashStrength;

    if (dashTimer < dashDuration)
    {
        dashTimer += Time.deltaTime;
    }
    else
    {
        state = PlayerState.Move;
        dashTrail.SetActive(false);
    }
}

private void RotatePlayer()
{
        if (isGamepad)
        {
            //Controller rotation
            if (Mathf.Abs(aim.x) > controllerDeadzone || Mathf.Abs(aim.y) > controllerDeadzone)
            {
                Vector3 playerDirection = Vector3.right * aim.x + Vector3.forward * aim.y;

                if (playerDirection.sqrMagnitude > 0.0f)
                {
                    Quaternion newRotation = Quaternion.LookRotation(playerDirection, Vector3.up);
                    transform.rotation = Quaternion.RotateTowards(transform.rotation, newRotation, controllerRotationSmoothing * Time.deltaTime);
                }
            }
        }
        else
        {
            //Mouse rotation
            Ray ray = Camera.main.ScreenPointToRay(aim);
            Plane groundPlane = new Plane(Vector3.up, Vector3.zero);
            float rayDistance;

            if (groundPlane.Raycast(ray, out rayDistance))
            {
                Vector3 point = ray.GetPoint(rayDistance);
                LookAt(point);
            }
        }   
}

private void LookAt(Vector3 _point)
{
    Vector3 heightCorrectedPoint = new Vector3(_point.x, transform.position.y, _point.z);
    transform.LookAt(heightCorrectedPoint);
}

//Input
public void OnDeviceChange(PlayerInput _input)
{
    isGamepad = _input.currentControlScheme.Equals("Gamepad") ? true : false;
}

private void OnTriggerEnter(Collider other)
{
    if (other.gameObject.CompareTag("Shotgun Pickup"))
    {
        cameraManager.ChangeCamera(cameraManager.currentCam, cameraManager.playerCamZoomedSmall);
    }
}

        `,
      },

      {
        name: "PlayerInteraction.cs",
        language: "C#",
        description:
          "I was also in charge of the player interaction, pickups, keycards and inventory. the code blocks below are conntected with this one",
        code: `
private void OnTriggerStay(Collider other)
{
    if (controls.Player.Interact.IsPressed())
    {
        if (other.gameObject.tag == "Interactable")
        {
            Debug.Log("Interacted with: " + other);

            InteractionIcon interactionIcon = other.GetComponentInChildren<InteractionIcon>();

            KeyCard keyCard = other.GetComponent<KeyCard>();
            if (keyCard != null && interactionIcon != null)
            {
                inventory.AddKeyCard(keyCard.GetKeyCardType());
                playerAudioSource.PlayOneShot(keycardPickUpClip, 1);
                Destroy(interactionIcon.gameObject);
                Destroy(keyCard.gameObject);
            }

            Door door = other.GetComponent<Door>();
            if (door == null)
            {
                return;
            }

            else if (inventory.ContainsKeyCard(door.GetKeyCardType()))
            {
                inventory.RemoveKeyCard(door.GetKeyCardType());
                door.OpenAllDoors(door.GetKeyCardType());
                playerAudioSource.PlayOneShot(doorOpenClip, 1);
            }
            
            if (!inventory.ContainsKeyCard(door.GetKeyCardType()))
            {
                door.PlayLockedAnimation(door);
            }
        }

        if (other.gameObject.tag == "Shotgun Pickup")
        {
            playerAudioSource.PlayOneShot(shotgunPickUpClip, 1);
            inventory.AddWeapon(Weapons.Shotgun);
            Destroy(other.gameObject);
            cameraManager.ChangeCamera(cameraManager.currentCam, cameraManager.playerCam);
        }
    }
}
        `,
      },

      {
        name: "PlayerInventory.cs",
        language: "C#",
        description:
          "This script shows the player inventory / weapon switching",
        code: `
public enum Weapons
{
    Rifle,
    Shotgun,
}

public Weapons selectedWeapon;

private void Start()
{
    AddWeapon(Weapons.Rifle);
    selectedWeapon = Weapons.Rifle;
}

public List<KeyCard.KeyCardType> GetKeyCardList()
{
    return keyCardList;
}

public void AddKeyCard(KeyCard.KeyCardType keyCardType)
{
    if (!keyCardList.Contains(keyCardType))
    {
        Debug.Log("Added KeyCard: " + keyCardType);
        keyCardList.Add(keyCardType);
        OnKeysChanged?.Invoke(this, EventArgs.Empty);
    }
    else
    {
        Debug.Log("KeyCard already in inventory: " + keyCardType);
    }
}


public void RemoveKeyCard(KeyCard.KeyCardType keyCardType)
{
    Debug.Log("Removed KeyCard: " + keyCardType);
    keyCardList.Remove(keyCardType);
    OnKeysChanged?.Invoke(this, EventArgs.Empty);
}

public bool ContainsKeyCard(KeyCard.KeyCardType keyCardType)
{
    return keyCardList.Contains(keyCardType);
}

public void AddWeapon(Weapons weapon)
{
    if (!weaponsList.Contains(weapon))
    {
        Debug.Log("Added Weapon: " + weapon);
        weaponsList.Add(weapon);
    }
    else
    {
        Debug.Log("KeyCard already in inventory: " + weapon);
    }
}

public Weapons GetSelectedWeapon()
{
    return selectedWeapon;
}

private void SwitchWeapon()
{
    if (weaponsList.Count > 1)
    {
        switch (selectedWeapon)
        {
            case Weapons.Rifle:
                audioSource.PlayOneShot(rifleSwitch, 1);
                selectedWeapon = Weapons.Shotgun;
                playerShootingRaycast = GetComponent<PlayerShootingRaycast>();
                playerShootingRaycast.shootingEffect = shotgunMuzzleFlash;
                break;

            case Weapons.Shotgun:
                audioSource.PlayOneShot(shotgunSwitch, 1);
                selectedWeapon = Weapons.Rifle;
                playerShootingRaycast = GetComponent<PlayerShootingRaycast>();
                playerShootingRaycast.shootingEffect = rifleMuzzleFlash;

                break;
        }
    }
}
        `,
      },

      {
        name: "KeyUI.cs",
        language: "C#",
        description: "This script shows the keycard stacking ui.",
        code: `
private void Awake()
{
    playerInventory = GameObject.Find("Player").GetComponent<PlayerInventory>();

    container = transform.Find("Container");
    keyCardTemplate = container.Find("Key Card Template");
    keyCardTemplate.gameObject.SetActive(false);
}

private void Start()
{
    playerInventory.OnKeysChanged += PlayerInventory_OnKeysChanged;
    UpdateVisual(); // Initial update
}

private void PlayerInventory_OnKeysChanged(object sender, System.EventArgs e)
{
    UpdateVisual();
}

private void UpdateVisual()
{
    // Clean up old keys
    foreach (Transform child in container)
    {
        if (child == keyCardTemplate) continue;
        Destroy(child.gameObject);
    }

    // Instantiate current key list
    List<KeyCard.KeyCardType> keyCardList = playerInventory.GetKeyCardList();
    for (int i = 0; i < keyCardList.Count; i++)
    {
        KeyCard.KeyCardType keyCardType = keyCardList[i];
        Transform keyCardTransform = Instantiate(keyCardTemplate, container);
        keyCardTransform.gameObject.SetActive(true);
        keyCardTransform.GetComponent<RectTransform>().anchoredPosition = new Vector2(distanceX * i, 0);
        Image keyCardImage = keyCardTransform.Find("Key Card Background").GetComponent<Image>();

        switch (keyCardType)
        {
            default:
            case KeyCard.KeyCardType.red: keyCardImage.color = Color.red; break;
            case KeyCard.KeyCardType.green: keyCardImage.color = Color.green; break;
            case KeyCard.KeyCardType.blue: keyCardImage.color = Color.blue; break;
            case KeyCard.KeyCardType.yellow: keyCardImage.color = Color.yellow; break;
            case KeyCard.KeyCardType.purple: keyCardImage.color = new Color(0.5f, 0.0f, 0.5f); break;
        }
    }
}
        `,
      },

      {
        name: "CameraManager.cs",
        language: "C#",
        description:
          "This is the camera manager I made for the game. This manager is able to switch cameras in a smooth way using CineMachine, and give screenshake when needed.",
        code: `
private void Start()
{
    //Set the current cam
    currentCam = playerCam;
    currentCam.Priority = 100;
}

public void ScreenShake(float amplitude, float frequency, float length)
{
    perlin = currentCam.GetCinemachineComponent<CinemachineBasicMultiChannelPerlin>();

    perlin.m_AmplitudeGain = amplitude;
    perlin.m_FrequencyGain = frequency;
    StartCoroutine(ShakeTimer(length));
}

public void ChangeCamera(CinemachineVirtualCamera oldCam, CinemachineVirtualCamera cam)
{
    oldCam.Priority = 0;
    cam.Priority = 100;

    currentCam = cam;
}

private IEnumerator ShakeTimer(float length)
{
    yield return new WaitForSeconds(length);

    //Reset noise
    perlin.m_AmplitudeGain = 0;
    perlin.m_FrequencyGain = 0;
}
        `,
      },

      {
        name: "GameManager.cs",
        language: "C#",
        description:
          "Here are some functions I made in the GameManager that improve the gameplay experience. The rumble was made with enabling the motors of the controller if the player is playing with a controller, and stopping it in a certain amount of time.",
        code: `
public void ControllerRumble(float leftMotorIntensity, float rightMotorIntensity, float time)
{
    if (player != null) 
    {
        if (player.isGamepad)
        {
            Gamepad.current.SetMotorSpeeds(0.50f, 0.50f);
            StartCoroutine(StopControllerRumble(time));
        }
    }
}

private IEnumerator StopControllerRumble(float time)
{
    yield return new WaitForSeconds(time);
    InputSystem.ResetHaptics();
}
        `,
      },
    ],
  },

  // Not Suepr Maria 63 //
  {
    title: "Not Suepr Maria 63",
    slug: "not-suepr-maria-63",
    banner: "/images/not suepr.webp",
    icon: "/images/not suepr.webp",
    date: "2025-04-17",
    displayDate: formatDisplayDate("2025-04-17"),
    platform: "Itch.io",
    description:
      "This is a remake of Super Mario 64 made in Unity using C#, but made in about 4 weeks of time for a school project. This game was made purely for fun and with love for the original game, I was not trying to make a full and polished remake with intent of having people playing this instead of the original. \n\nI remade the outside of the castle, a bit of the inside of the castle, and bob omb battlefield. Most models were ripped from the original game, but the animations were made by myself, because I could not find the original animations and mixamo animations didn't feel right with capturing the spirit of the original. \n\nWhat I made: \n- Player movement, attacks, animations, interactions etc \n- Scriptable Object based dialogue system that connects a dialogue sequence to the textbox, and spawns them accordingly \n- Scriptable Object based star system \n- GameManager script that handles the state of the game, star selection and loading the level accordingly based on the star that is selected. \n- Base enemy script that enemies could be built off of \n- Boss fight with King Bob Omb \n- Race with Koopa The Quick \n- Scene transitions \n- Cutscene system \n- Billboarded sprites",
    href: "https://linkerpink.itch.io/not-suepr-maria-63",
    github: "https://github.com/Linkerpink/NOT-Suepr-Maria-63",

    technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

    media: [
      { type: "image", src: "/images/not suepr.webp" },
      { type: "image", src: "/images/not suepr 1.png" },
      { type: "image", src: "/images/not suepr 2.png" },
      { type: "image", src: "/images/not suepr 3.png" },
      { type: "image", src: "/images/not suepr 4.png" },
      { type: "youtubeId", src: "9c8ntgfiQsk", title: "Gameplay Video" },
    ],

    featured: true,

    codeSnippets: [
      {
        name: "Mario.cs",
        language: "C#",
        description:
          "This is the script that has taken the longest to make by far. This is the script for handling the player's movement, animations, attacks and interactions. It is a very long script so I will not show the variable declarations, because that in it self is already 100 lines. The player works with a state machine which decides what the player character should be doing. It has a few health functions that make sure you can take damage, die and give damage to the enemies. The player has 3 damage hitboxes, one for the cick and one for the punch. those are handled through the animations itself, the other one is more interesting, because that one checks if something is under the player, so if the player jumps on top of an enemy, the enemy will take damage. The player also has a few functions that make sure the player can interact with the environment, like interacting with dialogue triggers, picking up items and collecting coins.",
        code: `
private void Update()
{
    isGrounded = Physics.Raycast(transform.position, Vector3.down, groundedRayCastLength, groundLayer);
    isOnEnemy = Physics.Raycast(transform.position, Vector3.down, groundedRayCastLength, enemyLayer);
    isCollidingWithPole = Physics.Raycast(transform.position, Vector3.down, groundedRayCastLength, poleLayer);
    
    if (inputDirection.sqrMagnitude > 0.01f && state != States.DiveSlide && canMove) 
    {
        moveDirection = new Vector3(inputDirection.x, 0, inputDirection.y);
        targetAngle = Mathf.Atan2(moveDirection.x, moveDirection.z) * Mathf.Rad2Deg + cameraTransform.eulerAngles.y;
        angle = Mathf.SmoothDampAngle(transform.eulerAngles.y, targetAngle, ref turnSmoothVelocity, turnSmoothTime);
        lastAngle = angle;
    }
    else
    {
        moveDirection = Vector3.zero;
        angle = lastAngle;
    }
    
    // Set values for the Animator
    m_animator.SetFloat("stickMovement", moveDirection.sqrMagnitude);
    m_animator.SetBool("isGrounded", isGrounded);
    
    // Decide what state to switch to
    if (canMove && state != States.Jump && state != States.GroundPound && state != States.LongJump && isGrounded && state != States.GroundPound && state != States.Dive && state != States.Punch && state != States.Kick && state != States.DiveSlide && state != States.InsideCannon)
    {
        if (!isCrouching)
        {
            // If not crouching
            
            if (inputDirection.sqrMagnitude >= 0.25f)
            {
                state = States.Run;
                m_animator.Play("Run");
            }
            else if (inputDirection.sqrMagnitude >= 0.01f)
            {
                state = States.Walk;
            }
            else if (state != States.Kick && state != States.Punch)
            {
                state = States.Idle;
                //m_animator.SetTrigger("land");
            }
            
            m_animator.SetBool("crouch", false);
        }
        else
        {
            // If crouching
            
            if (inputDirection.sqrMagnitude >= stickDeadZone)
            {
                state = States.CrouchWalk;
                
            }
            else if (state != States.Kick && state != States.Punch)
            {
                state = States.Crouch;
                m_animator.SetBool("crouch", true);
            }
        }
    }

    if (!isGrounded && state != States.GroundPound && state != States.LongJump && state != States.Dive && state != States.Punch && state != States.Kick)
    {
        state = States.Jump;

        switch (jumpCount)
        {
            case 1:
                m_animator.Play("Jump");
                break;
            
            case 2:
                m_animator.Play("Double Jump");
                break;
            
            case 3:
                m_animator.Play("Triple jump");
                break;
        }
    }
    
    // State switching
    switch (state)
    {
        //////////Movement//////////////
        
        // Idle
        case States.Idle:
            moveSpeed = Mathf.Max(moveSpeed - deceleration * Time.deltaTime, 0);
            jumpCount = 0;
            isCrouching = false;
            break;
        
        // Walk
        case States.Walk:
            moveSpeed = Mathf.Min(moveSpeed + acceleration * Time.deltaTime, maxWalkMoveSpeed);
            isCrouching = false;
            break;
        
        // Run
        case States.Run:
            moveSpeed = Mathf.Min(moveSpeed + acceleration * Time.deltaTime, maxMoveSpeed);
            isCrouching = false;
            break;
        
        // Jump
        case States.Jump:
            moveSpeed = Mathf.Min(moveSpeed + acceleration * Time.deltaTime, maxMoveSpeed);
            jumpTimer = jumpTimerDuration;
            
            if (isGrounded && canMove || isCollidingWithPole && canMove)
            {
                m_animator.SetTrigger("land");
                state = States.Idle;
            }
            
            isCrouching = false;
            break;
        
        // Crouch
        case States.Crouch:
            moveSpeed = Mathf.Min(moveSpeed + acceleration * Time.deltaTime, maxCrouchMoveSpeed);
            isCrouching = true;
            break;
        
        // CrouchWalk
        case States.CrouchWalk:
            moveSpeed = Mathf.Min(moveSpeed + acceleration * Time.deltaTime, maxCrouchMoveSpeed);
            isCrouching = true;
            break;
        
        // GroundPound
        case States.GroundPound:
            float _verticalMovement = 0f;

            if (groundPoundTimer <= 0)
            {
                _verticalMovement = groundPoundMoveSpeed;
            }
            
            m_rigidbody.linearVelocity = new Vector3(0, _verticalMovement, 0);

            if (isGrounded && canMove)
            {
                state = States.Idle;
                m_animator.SetTrigger("land");
            }

            if (isCollidingWithPole && canMove)
            {
                state = States.Idle;
                m_animator.SetTrigger("land");

                ChainChompPole _pole = GameObject.Find("Chain Chomp Area").GetComponentInChildren<ChainChompPole>();
                
                _pole.IncreasePolePosition();
            }
            
            jumpCount = 0;
            isCrouching = false;
            break;
            
        // LongJump
        case States.LongJump:
            isCrouching = false;
            m_animator.SetTrigger("longJump");
            
            if (longJumpTimer < longJumpTimerDuration / 2)
            {
                longJumpTimer += Time.deltaTime;
                
                float _jumpForce = jumpForce / 1.5f;
                float _jumpSpeed = moveSpeed * 6;
                m_rigidbody.linearVelocity = new Vector3(bufferedMoveDirection.x * _jumpSpeed, _jumpForce, bufferedMoveDirection.z * _jumpSpeed);
            }
            else if (longJumpTimer < longJumpTimerDuration)
            {
                longJumpTimer += Time.deltaTime;
                float _jumpForce = 0f;
                float _jumpSpeed = moveSpeed * 6;
                m_rigidbody.linearVelocity = new Vector3(bufferedMoveDirection.x * _jumpSpeed, _jumpForce, bufferedMoveDirection.z * _jumpSpeed);
            }
            else
            {
                if (isGrounded && canMove || isCollidingWithPole && canMove)
                {
                    state = States.Idle;
                    longJumpTimer = 0;
                    m_animator.SetTrigger("land");
                }
            }
            break;
        
        // HighJump
        case States.HighJump:
            if (isGrounded && canMove || isCollidingWithPole && canMove)
            {
                m_animator.SetTrigger("land");
                state = States.Idle;
            }
            
            isCrouching = false;
            break;
        
        // DiveSlide
        case States.DiveSlide:
            moveDirection = new Vector3(bufferedMoveDirection.x, 0, bufferedMoveDirection.z);
            
            if (diveSlideTimer <= 0 && canMove)
            {
                state = States.Idle;
                m_animator.SetTrigger("land");
            }
            isCrouching = false;
            break;
        
        //////////Attacks//////////////
        
        // Punch
        case States.Punch:
            if (attackTimer <= 0)
            {
                state = States.Idle;
            }
            moveDirection = Vector3.zero;
            isCrouching = false;
            break;
        
        // Kick
        case States.Kick:
            if (attackTimer <= 0)
            {
                state = States.Idle;
            }
            moveDirection = Vector3.zero;
            isCrouching = false;
            break;
        
        // Dive
        case States.Dive:
            if (isGrounded || isCollidingWithPole && canMove)
            {
                state = States.DiveSlide;
                diveSlideTimer = diveSlideTimerDuration;
            }
            jumpCount = 0;
            isCrouching = false;
            break;
    }
    
    // Set movement and rotations
    if (state != States.GroundPound && state != States.LongJump && state != States.Dive)
    {
        transform.rotation = Quaternion.Euler(0f, angle, 0f);
    }
    
    if (moveDirection != Vector3.zero)
    {
        moveDirection = Quaternion.Euler(0f, targetAngle, 0f) * Vector3.forward;
    }

    velocity = moveDirection.normalized * moveSpeed;
    if (state != States.GroundPound && state != States.LongJump && state != States.Dive && state != States.DiveSlide)
    {
        m_rigidbody.linearVelocity = new Vector3(velocity.x, m_rigidbody.linearVelocity.y, velocity.z);
    }

    // Timers
    if (jumpTimer > 0 && isGrounded)
    {
        jumpTimer -= Time.deltaTime;
    }
    
    if (groundPoundTimer > 0 && state == States.GroundPound)
    {
        groundPoundTimer -= Time.deltaTime;
    }
    
    if (jumpTimer <= 0)
    {
        jumpCount = 0;
    }

    if (attackTimer > 0)
    {
        attackTimer -= Time.deltaTime;
    }

    if (attackComboTimer > 0)
    {
        attackComboTimer -= Time.deltaTime;
    }
    else
    {
        attackCount = 0;
    }

    if (attackCount > 3 && canMove)
    {
        attackCount = 0;
        m_animator.SetTrigger("land");
    }

    if (diveSlideTimer > 0)
    {
        diveSlideTimer -= Time.deltaTime;
    }
    
    // Iframes
    if (iFrameTimer > 0)
    {
        iFrameTimer -= Time.deltaTime;

        if (blinkTimer <= 0)
        {
            blinkTimer = blinkTimerDuration;
            m_showModel = !m_showModel;
        }

        if (blinkTimer > 0)
        {
            blinkTimer -= Time.deltaTime;
        }
    }
    else
    {
        m_showModel = true;
    }

    if (m_showModel)
    {
        m_marioVisual.SetActive(true);
    }
    else
    {
        m_marioVisual.SetActive(false);
    }
    
    if (canMove)
    {
        m_playerInput.actions.FindActionMap("Player").Enable();
        m_playerInput.actions.FindActionMap("UI").Disable();
    }
    else
    {
        m_playerInput.actions.FindActionMap("Player").Enable();
        m_playerInput.actions.FindActionMap("UI").Disable();
    }
    
    // Star stuff
    if (m_pickedUpStar)
    {
        canMove = false;

        if (isGrounded && !m_startedVictoryPose)
        {
            m_startedVictoryPose = true;
            m_animator.SetTrigger("victoryPose");
        }
    }
    
    // Holding objects
    if (heldObject != null)
    {
        heldObject.transform.position = new Vector3(transform.position.x, transform.position.y + 2, transform.position.z);
        heldObject.transform.rotation = Quaternion.Euler(0f, angle, 0f);

        if (heldObject.name == "King Bob Omb" && m_kingBobOmb != null)
        {
            m_kingBobOmb.state = KingBobOmb.States.Grabbed;
        }
    }
}

public void OnMove(InputAction.CallbackContext _context)
{
    inputDirection = _context.ReadValue<Vector2>();
}

public void OnJump(InputAction.CallbackContext _context)
{
    if (_context.performed && canMove && state != States.InsideCannon)
    {
        // Long jump
        if (state != States.LongJump && state != States.Dive)
        {
            bufferedMoveDirection = moveDirection;    
        }
        
        if (state == States.CrouchWalk && moveDirection.sqrMagnitude > stickDeadZone)
        {
            jumpCount = 1;
        
            state = States.LongJump;
        }
    
        // Jump
        if (isGrounded && state != States.Jump && state != States.LongJump && state != States.DiveSlide || isCollidingWithPole && state != States.Jump && state != States.LongJump && state != States.DiveSlide)
        {
            if (jumpCount < 3)
            {
                jumpCount++;                
            }
        
            float _jumpForce = jumpForce + jumpCount;
            m_rigidbody.linearVelocity = new Vector3(m_rigidbody.linearVelocity.x, _jumpForce, m_rigidbody.linearVelocity.z);
            state = States.Jump;
        }
        
        // High jump
        if (state == States.Crouch)
        {
            m_animator.SetBool("crouch", false);
            
            state = States.HighJump;
            
            m_rigidbody.linearVelocity = new Vector3(m_rigidbody.linearVelocity.x, jumpForce * 2f, m_rigidbody.linearVelocity.z);
            
            m_animator.SetTrigger("highJump");
        }

        if (state == States.DiveSlide && isGrounded && canMove)
        {
            state = States.Idle;
            m_animator.SetTrigger("land");
        }
    }

    if (_context.performed && state == States.InsideCannon)
    {
        float _jumpForce = jumpForce * 10f;
        m_rigidbody.linearVelocity = new Vector3(m_rigidbody.linearVelocity.x, _jumpForce, m_rigidbody.linearVelocity.z);
        state = States.Jump;
    }
}

public void OnCrouch(InputAction.CallbackContext _context)
{
    if (_context.performed && canMove)
    {
        if (isGrounded)
        {
            isGrounded = true;
            isCrouching = true;
            m_animator.SetBool("crouch", true);
        }
        else if (state != States.GroundPound && !isGrounded)
        {
            m_animator.SetTrigger("groundPound");
            state = States.GroundPound;
            groundPoundTimer = groundPoundTimerDuration;
        }
    }
    
    if (_context.canceled && state == States.Crouch || _context.canceled && state == States.CrouchWalk)
    {
        isCrouching = false;
        m_animator.SetBool("crouch", false);
    }
}

public void OnAttack(InputAction.CallbackContext _context)
{
    if (_context.performed && canMove)
    {
        // Hold king bob omb
        if (heldObject == null && isCollidingWithKingBobOmb && m_kingBobOmbObject != null)
        {
            heldObject = m_kingBobOmbObject;
        }

        // Throw object
        if (heldObject != null)
        {
            print("throw object");
            
            heldObject.transform.position = new Vector3(heldObject.transform.position.x, transform.position.y + 4, heldObject.transform.position.z) + transform.forward * 4f;

            if (heldObject.name == "King Bob Omb" && m_kingBobOmb != null && m_kingBobOmb.state == KingBobOmb.States.Grabbed)
            {
                m_kingBobOmb.state = KingBobOmb.States.Thrown;
                heldObject = null;
            }
        }
        
        // Dialogue
        if (m_isCollidingWithDialogueHitbox && m_dialogueHitbox != null)
        {
            DialogueSequence _dialogueSequence = m_dialogueHitbox.GetComponent<DialogueGiver>().dialogueSequence;
            m_textbox.StartDialogueSequence(_dialogueSequence);
        }
        
        // Attacking
        if (attackCount <= 2 && isGrounded && attackTimer <= 0 && moveDirection.sqrMagnitude < stickDeadZone)
        {
            // Punch
            attackCount++;
            state = States.Punch;
            m_animator.Play("Punch");
            attackTimer = attackTimerDuration;
            attackComboTimer = attackComboTimerDuration;
        }
        else if (state != States.Run && attackTimer <= 0 && moveDirection.sqrMagnitude < stickDeadZone)
        {
            // Kick
            attackCount++;
            state = States.Kick;
            m_animator.Play("Kick");
            attackTimer = attackTimerDuration;
            attackComboTimer = attackComboTimerDuration;
        }
        
        if (state != States.Dive && state != States.DiveSlide && moveDirection.sqrMagnitude > stickDeadZone && state != States.LongJump && !isGrounded)
        {
            //Dive
            attackCount++;
            state = States.Dive;
            m_animator.Play("Dive");
            m_rigidbody.linearVelocity = new Vector3(m_rigidbody.linearVelocity.x * 1.5f, m_rigidbody.linearVelocity.y, m_rigidbody.linearVelocity.z * 1.5f);
        }
    }
}

public void TakeDamage(int _damageAmount)
{
    if (iFrameTimer <= 0)
    {
        hp -= _damageAmount;
        if (hp <= 0)
        {
            Die();
        }

        iFrameTimer = iFrameDuration;
        
        // Power Meter
        if (!m_powerMeter.showing)
        {
            print("show power meter");
            m_powerMeter.ShowPowerMeter();
        }
        else
        {
            print("skill issueee");
        }
    }
}

public void Heal(int _healAmount)
{
    if (hp < 8)
    {
        hp += _healAmount;    
    }
    
    // Power Meter
    if (m_powerMeter.showing && hp >= 8)
    {
        print("hide power meter");
        m_powerMeter.HidePowerMeter();
    }
}

public void Die()
{
    SceneManager.LoadScene("Peach's Castle Inside Main Room");
}

private void OnTriggerEnter(Collider other)
{
    if (other.CompareTag("Jump Hitbox"))
    {
        if (isOnEnemy)
        {
            other.GetComponentInParent<Enemy>().TakeDamage(1);
            m_rigidbody.AddForce(0f,10f,0f,ForceMode.Impulse);
        }
    }

    if (other.CompareTag("King Bob Omb"))
    {
        isCollidingWithKingBobOmb = true;
        m_kingBobOmbObject = other.gameObject;
    }
    
    if (other.CompareTag("Dialogue Hitbox"))
    {
        m_isCollidingWithDialogueHitbox = true;
        m_dialogueHitbox = other;
    }

    if (other.CompareTag("Star"))
    {
        print("should pick up star");
        GameManager.Instance.GetStar(other.gameObject.GetComponent<StarHolder>().star);
        other.gameObject.SetActive(false);
        m_pickedUpStar = true;
    }

    if (other.CompareTag("Top Hitbox"))
    {
        RaceManager _raceManager = FindObjectOfType<RaceManager>();

        if (_raceManager != null)
        {
            _raceManager.EndRace();

            if (_raceManager.raceState == RaceManager.RaceStates.Racing)
            {
                _raceManager.raceState = RaceManager.RaceStates.Won;
            }    
        }

        if (GameManager.Instance.currentStar != null && m_kingBobOmb != null)
        {
            if (m_kingBobOmb.stage == 0 && GameManager.Instance.currentStar.name == "Star 1")
            {
                m_textbox.StartDialogueSequence(m_kingBobOmbStartBattleDialogueSequence);    
            }
        }

        if (!GameManager.Instance.shownCastleIntroDialogue)
        {
            if (other.CompareTag("Castle Dialogue"))
            {
                GameManager.Instance.shownCastleIntroDialogue = true;
                m_textbox.StartDialogueSequence(GameManager.Instance.castleIntroDialogueSequence);

            }
        }
    }

    if (other.CompareTag("Enemy"))
    {
        Enemy _enemy = other.GetComponent<Enemy>();
        
        if (!isOnEnemy && state != States.Punch && state != States.Kick && state != States.Dive &&
            state != States.Jump && state != States.GroundPound)
        {
            TakeDamage(_enemy.damageAmount);
        }
        else
        {
            _enemy.TakeDamage(1);
        }
    }

    if (other.CompareTag("Death"))
    {
        Die();
    }
}

private void OnTriggerExit(Collider other)
{
    if (other.CompareTag("Dialogue Hitbox"))
    {
        m_isCollidingWithDialogueHitbox = false;
    }
    
    if (other.CompareTag("King Bob Omb"))
    {
        isCollidingWithKingBobOmb = false;
        m_kingBobOmbObject = null;
    }
}

private void OnTriggerStay(Collider other)
{
    if (other.CompareTag("Cannon"))
    {
        state = States.InsideCannon;
    }
}
`,
      },

      {
        name: "DialogueSequence.cs",
        language: "C#",
        description: "This is the Scriptable Object in charge of making a sequence of dialogue that the textbox will follow. It has a string array where you can add different pages of dialogue to in the editor. It has values for the color that the textbox needs to be. It also has possible ending functions, like opening a cannon, starting / ending fights and starting a race",
        code: `
public string[] dialogue;

public Color textBoxColor;
public Color textColor;

public enum DialogueTypes
{
    Nothing,
    KingBobOmbStartFight,
    KingBobOmbEndFight,
    KoopaTheQuickStartRace,
    KoopaTheQuickWinRace,
    KoopaTheQuickLoseRace,
    PinkBobOmbOpenCannon,
}

public DialogueTypes dialogueType;

private Mario m_mario;

private GameManager m_gameManager;

private void Awake()
{
    m_gameManager = FindObjectOfType<GameManager>();
}

public void EndDialogueFunction()
{
    switch (dialogueType)
    {
        case DialogueTypes.KingBobOmbStartFight:
            KingBobOmb _kingBobOmb = FindAnyObjectByType<KingBobOmb>();
            _kingBobOmb.StartFight();
            break;
        
        case DialogueTypes.KingBobOmbEndFight:
            _kingBobOmb = FindAnyObjectByType<KingBobOmb>();
            _kingBobOmb.EndFight();
            break;
        
        case DialogueTypes.KoopaTheQuickStartRace:
            KoopaTheQuick _koopaTheQuick = FindAnyObjectByType<KoopaTheQuick>();
            _koopaTheQuick.StartRace();
            break;
        
        case DialogueTypes.KoopaTheQuickWinRace:
            _koopaTheQuick = FindAnyObjectByType<KoopaTheQuick>();
            _koopaTheQuick.WinRace();
            break;
        
        case DialogueTypes.KoopaTheQuickLoseRace:
            m_mario = FindObjectOfType<Mario>();
            m_mario.Die();
            break;
        
        case DialogueTypes.PinkBobOmbOpenCannon:
            // Open Cannons
            m_gameManager = FindAnyObjectByType<GameManager>();
            if (!GameManager.Instance.cannonsOpened)
            {
                m_mario = FindObjectOfType<Mario>();
                Animator m_animator = GameObject.Find("Cannon Covers").GetComponent<Animator>();
                m_animator.SetTrigger("openCannon");
                m_mario.canMove = false;
            }
            break;
    }
}
	`,
      },

      {
        name: "Textbox.cs",
        language: "C#",
        description: "This is the textbox script that loads in the information from the DialogueSequence that is given to the textbox.",
        code: `
private void Update()
{
    if (!m_textboxExists)
    {
        m_background.color = Color.clear;
        m_text.color = Color.clear;
    }
}

public void StartDialogueSequence(DialogueSequence _sequence)
{
    if (!m_textboxExists)
    {
        m_mario.canMove = false;
        m_textboxExists = true;
        m_sequence = _sequence;
    
        ResetTextbox();
    
        SpawnTextbox(m_sequence.dialogue[m_page]);    
    }
}

private void SpawnTextbox(string _text)
{
    m_background.color = m_sequence.textBoxColor;
    m_text.color = m_sequence.textColor;
    
    m_text.SetText(_text);
    
    m_animator.SetTrigger("textboxIn");
}

public void OnSubmit(InputAction.CallbackContext _context)
{
    if (_context.performed && m_sequence != null)
    {
        print("submit");
        if (m_page < m_sequence.dialogue.Length - 1 && m_textboxExists)
        {
            m_page++;
            SpawnTextbox(m_sequence.dialogue[m_page]);
        }
        else if (m_textboxExists)
        {
            m_sequence.EndDialogueFunction();
            m_animator.SetTrigger("textboxOut");
            m_textboxExists = false;
            m_mario.canMove = true;
        }
    }
}

private void ResetTextbox()
{
    m_page = 0;
}
        `,
      },

      {
        name: "GameManager.cs",
        language: "C#",
        description:
          "This is the script that handles the state of the game, star selection and loading the level accordingly based on the star that is selected. It also has the screenshake function I made for Robo Rebellion.",
        code: `
private void Update()
{
    print(starsCollected.Count);
    if (Input.GetKeyDown(KeyCode.B))
    {
        enableDebug = !enableDebug;
    }

    if (Input.GetKeyDown(KeyCode.R))
    {
        if (m_mario != null)
        {
            m_mario.Die();
        }
        
    }
    
    if (Input.GetKeyDown(KeyCode.Escape))
    {
        lockCursor = false;
    }
    
    // UI
    if (m_starsText != null)
    {
        SetStarsText();
    }

    if (m_coinsText != null)
    {
        SetCoinsText();
    }

    // Application
    if (Application.isFocused)
    {
        lockCursor = true;
    }

    Cursor.lockState = lockCursor ? CursorLockMode.Locked : CursorLockMode.None;
}

private void OnSceneLoaded(Scene scene, LoadSceneMode mode)
{
    StartCoroutine(SetObjectsWhenReady());
}

private void SetObjects()
{
    currentScene = SceneManager.GetActiveScene().name;
    
    m_canvas = GameObject.Find("Canvas");

    if (m_canvas != null)
    {
        foreach (Transform _child in m_canvas.transform)
        {
            if (_child.name == "Background")
            {
                m_backgroundAnimator = _child.GetComponent<Animator>();
                StartTransitionAnimation("fadeOutWhite");
            }

            if (_child.name == "Star Select")
            {
                SetStarText();
            }
        }
    }
    
    m_starSelect = GameObject.Find("Star Select");
    m_starObjects = GameObject.Find("Star Objects");
    
    m_mario = FindAnyObjectByType<Mario>();

    if (m_mario != null)
    {
        if (m_starSelect != null)
        {
            m_mario.canMove = false;   
        }
        else
        {
            m_mario.canMove = true;    
        }
    }
    
    m_starsText = GameObject.Find("Stars Text").GetComponent<TextMeshProUGUI>();
    m_coinsText = GameObject.Find("Coins Text").GetComponent<TextMeshProUGUI>();
    
    coinsCollected = 0;
    spawned100CoinStar = false;
}

private IEnumerator SetObjectsWhenReady()
{
    while (GameObject.Find("Canvas") == null)
    {
        yield return null;
    }
    SetObjects();
}


public void StartTransitionAnimation(string _animation)
{
    if (m_backgroundAnimator != null)
    {
        m_backgroundAnimator.SetTrigger(_animation);
    }
}

public UnityAction SelectStar(Star _star)
{
    StartCoroutine(InitializeLevel(_star));
    currentStar = _star;
    
    if (_star.name == "Star 1")
    {
        m_mario.m_kingBobOmbObject = FindAnyObjectByType<KingBobOmb>().gameObject;
        m_mario.m_kingBobOmb = m_mario.m_kingBobOmbObject.GetComponent<KingBobOmb>();
    }

    SetStarsText();
    
    return null;
}

public IEnumerator InitializeLevel(Star _star)
{
    if (m_starSelect == null && m_starObjects == null)
    {
        Debug.Log("zelfm,orod");
        SetObjects();
        yield return new WaitForSeconds(0.1f);
    }
    else
    {
        SetObjects();
        m_starSelect.SetActive(false);
        m_starObjects.SetActive(true);
        m_mario.canMove = true;

        foreach (Transform _child in m_starObjects.transform)
        {
            _child.gameObject.SetActive(false);
        }
        
        if (_star.name == "Star 1")
        {
            foreach (Transform _child in m_starObjects.transform)
            {
                if (_child.name == "Star 1 Objects")
                {
                    _child.gameObject.SetActive(true);
                    
                    foreach (Transform _child2 in _child.transform)
                    {
                        _child2.gameObject.SetActive(true);
                    }
                }
                else
                {
                    _child.gameObject.SetActive(false);
                }
            }
        }
        
        if (_star.name == "Star 2")
        {
            foreach (Transform _child in m_starObjects.transform)
            {
                if (_child.name == "Star 2 Objects")
                {
                    _child.gameObject.SetActive(true);
                    
                    foreach (Transform _child2 in _child.transform)
                    {
                        _child2.gameObject.SetActive(true);
                    }
                }
                else
                {
                    _child.gameObject.SetActive(false);
                }
            }
        }

        if (_star.name == "Star 3")
        {
            foreach (Transform _child in m_starObjects.transform)
            {
                if (_child.name == "Star 3 Objects")
                {
                    _child.gameObject.SetActive(true);
                    
                    foreach (Transform _child2 in _child.transform)
                    {
                        _child2.gameObject.SetActive(true);
                    }
                }
                else
                {
                    _child.gameObject.SetActive(false);
                }
            }
        }

        yield return null;
    }
}

public void HoverOverStar(Star _star)
{
    m_canvas = FindAnyObjectByType<Canvas>().gameObject;
    SetStarText();
    m_starText.SetText(_star.starName);
}

private void SetStarText()
{
    GameObject _starText = GameObject.Find("Star Name Text");

    if (_starText != null)
    {
        m_starText = GameObject.Find("Star Name Text").GetComponent<TextMeshProUGUI>();    
    }
}

private void SetStarsText()
{
    m_starsText = GameObject.Find("Stars Text").GetComponent<TextMeshProUGUI>();
    
    if (m_starsText != null)
    {
        m_starsText.SetText("X" + starsCollected.Count);
    }
}

private void SetCoinsText()
{
    m_coinsText = GameObject.Find("Coins Text").GetComponent<TextMeshProUGUI>();
    
    if (m_coinsText != null)
    {
        m_coinsText.SetText("X" + coinsCollected);
    }
}

public void SpawnStar(Star _star, Vector3 _position)
{
    GameObject _starObject = Instantiate(m_starPrefab, new Vector3(_position.x, _position.y, _position.z), Quaternion.identity);

    _starObject.GetComponentInChildren<StarHolder>().star = _star;
}

public void GetStar(Star _star)
{
    if (!starsCollected.Contains(_star))
    {
        starsCollected.Add(_star);
    }
    
    currentStar = null;
    
    print("starsCollected: " + starsCollected);
}

public void ScreenShake(float _amplitude, float _frequency, float _duration)
{
    m_perlin = GameObject.Find("Player Camera").GetComponent<CinemachineBasicMultiChannelPerlin>();
    
    m_perlin.AmplitudeGain = _amplitude;
    m_perlin.FrequencyGain = _frequency;
    StartCoroutine(ShakeTimer(_duration));
}

private IEnumerator ShakeTimer(float _duration)
{
    yield return new WaitForSeconds(_duration);

    //Reset noise
    m_perlin.AmplitudeGain = 0;
    m_perlin.FrequencyGain = 0;
}
        `,
      },

      {
	name: "Enemy.cs",
	language: "C#",
	description: "",
	code: `
public enum States
{
    Patroling,
    ChargePlayer,
}

public States state = States.Patroling;

private void Awake()
{
    m_mario = FindAnyObjectByType<Mario>();
    m_marioTransform = m_mario.transform;
    agent = GetComponent<NavMeshAgent>();
    m_animator = GetComponentInChildren<Animator>();
}

private void Update()
{
    // Check for sight and attack range
    playerInSightRange = Physics.CheckSphere(transform.position, sightRange, playerLayer);

    if (!playerInSightRange)
    {
        state = States.Patroling;
    }

    if (playerInSightRange)
    {
        state = States.ChargePlayer;
    }
    
    // State switching
    switch (state)
    {
        // Patroling
        case States.Patroling:
            
            if (!walkPointSet)
            {
                SearchWalkPoint();
            }

            if (walkPointSet)
            {
                agent.SetDestination(walkPoint);
            }

            Vector3 distanceToWalkPoint = transform.position - walkPoint;

            // Walkpoint reached
            if (distanceToWalkPoint.magnitude < 1f)
            {
                walkPointSet = false;
            }
            
            if (m_mario.canMove)
            {
                agent.speed = patrolSpeed;
            }
            else
            {
                agent.speed = 0;
            }
            
            break;
        
        // Carge Player
        case States.ChargePlayer:
            
            if (m_mario.canMove)
            {
                agent.SetDestination(m_marioTransform.position);
                agent.speed = runSpeed;    
            }
            else
            {
                agent.speed = 0;
            }
            
            break;
    }
}

private void SearchWalkPoint()
{
    // Calculate random point in range
    float randomZ = Random.Range(-walkPointRange, walkPointRange);
    float randomX = Random.Range(-walkPointRange, walkPointRange);

    walkPoint = new Vector3(transform.position.x + randomX, transform.position.y, transform.position.z + randomZ);

    if (Physics.Raycast(walkPoint, -transform.up, 2f, groundLayer))
    {
        walkPointSet = true;
    }
}

private void OnDrawGizmosSelected()
{
    Gizmos.color = Color.yellow;
    Gizmos.DrawWireSphere(transform.position, sightRange);
    Gizmos.color = Color.red;
    Gizmos.DrawWireSphere(transform.position, walkPointRange);
}

private void DamagePlayer(int _damageAmount)
{
    m_mario.TakeDamage(_damageAmount);
}

public void TakeDamage(int _damageAmount)
{
    hp -= _damageAmount;

    if (hp <= 0)
    {
        Die();
    }
}

private void Die()
{
    gameObject.SetActive(false);
}
	`
    },

{
	name: "KingBobOmb.cs",
	language: "C#",
	description: "",
	code: `
public enum States
{
	Idle,
	Walking,
	Grabbing,
	Throwing,
	Grabbed,
	Thrown,
}

public States state = States.Idle;

[SerializeField] private Star m_kingBobOmbStar;

private void Awake()
{
	m_mario = FindAnyObjectByType<Mario>();
	m_marioTransform = m_mario.transform;
	agent = GetComponent<NavMeshAgent>();
	m_animator = GetComponentInChildren<Animator>();
	m_gameManager = FindAnyObjectByType<GameManager>();
	m_textbox = FindAnyObjectByType<Textbox>();
}

private void Update()
{
	isGrounded = Physics.Raycast(transform.position, Vector3.down, 0.5f, groundLayer);
	
	switch (state)
	{
		case States.Idle:
			if (goToWalkTimer > 0)
			{
				goToWalkTimer -= Time.deltaTime;
			}
			else
			{
				state = States.Walking;
			}
			break;
			
		case States.Walking:
			if (stage > 0 && stage < 3)
			{
				agent.SetDestination(walkPoint);

				if (setWalkPointTimer > 0)
				{
					setWalkPointTimer -= Time.deltaTime;
				}
				else
				{
					SetWalkPoint(m_marioTransform.position);
					setWalkPointTimer = setWalkPointTimerDuration;
				}

				if (stage < 2)
				{
					agent.angularSpeed = 75;
				}
				else
				{
					agent.angularSpeed = 180;
					setWalkPointTimerDuration = 0.25f;
				}    
			}
			else
			{
				state = States.Idle;
			}
			break;
		
		case States.Grabbed:
			
			break;
		
		case States.Thrown:
			if (isGrounded)
			{
				state = States.Walking;
				stage++;
				m_gameManager.ScreenShake(10,10,0.25f);
			}
			break;
	}

	if (stage > 3)
	{
		m_textbox.StartDialogueSequence(m_loseDialogueSequence);
		stage = -1;
	}
}

private void SetWalkPoint(Vector3 _walkPoint)
{
	walkPoint = _walkPoint;
}

public void StartFight()
{
	state = States.Walking;
	stage = 1;
}

public void EndFight()
{
	GameManager.Instance.SpawnStar(m_kingBobOmbStar, new Vector3(transform.position.x, transform.position.y + 2.5f, transform.position.z));
	gameObject.SetActive(false);
}
	`
},

{
	name: "KoopaTheQuick.cs",
	language: "C#",
	description: "",
	code: `
private void Update()
{
	print(racing);
	
	if (racing)
	{
		float _remainingDist = Vector3.Distance(transform.position, waypoints[m_currentWaypoint].position);
			
		if (_remainingDist <= 1f  &&  m_currentWaypoint < waypoints.Length - 1)
		{
			m_currentWaypoint++;
			SetWaypoint();
		}

	}
	
	print(m_currentWaypoint);
}

public void StartRace()
{
	racing = true;
	SetWaypoint(); 
	m_raceManager= FindAnyObjectByType<RaceManager>();
	m_raceManager.StartRace();
}

private void SetWaypoint()
{
	print("SET WAYPOINT 5 BIG BOOOOMB");
	m_agent.destination = waypoints[m_currentWaypoint].position;
}

private void OnTriggerEnter(Collider other)
{
	if (other.CompareTag("Top Hitbox"))
	{
		if (m_raceManager.raceState == RaceManager.RaceStates.Racing)
		{
			m_raceManager.raceState = RaceManager.RaceStates.Lost;
			
			m_textbox.StartDialogueSequence(m_lostDialogue);
		}
		
		if (m_raceManager.raceState == RaceManager.RaceStates.Won)
		{
			m_textbox.StartDialogueSequence(m_wonDialogue);
		}
	}
}

public void WinRace()
{
	m_agent.enabled = false;
	print("race gewonnen :O");
	GameManager.Instance.SpawnStar(m_star, new Vector3(transform.position.x, transform.position.y + 2.5f, transform.position.z));
	racing = false;
	gameObject.SetActive(false);
}
	`
}





    ],
  },

  // The Royal Spin //
  {
    title: "The Royal Spin",
    slug: "the-royal-spin",
    banner: "/images/the royal spin banner.png",
    icon: "/images/the royal spin logo.png",
    date: "2025-07-14",
    displayDate: formatDisplayDate("2025-07-14"),
    platform: "Itch.io",
    description:
      "The Royal Spin is a game made by a group of 4 students. \n\nGamble and drink your heart out to pay rent and turn the tide with powerful spell cards. In this game you play Slots, Roulette and Russian Roulette. The goal is buying keys to escape. \n\nDevelopers: \nhttps://sites.google.com/view/mark-biesheuvel-portfolio \nhttps://linkerpink.vercel.app/ \n\nArtists: \nhttps://www.artstation.com/bellebunnik \nhttps://www.artstation.com/sekerio \n\nWhat I made: \n- Game Settings \n- Shop \n- GameManager script that holds the game state and displays the items in the player's inventory at that moment \n- Russian Roulette \n- Rent system \n- Sound System \n- Keys & Doors \n- Main Menu camera sequences",
    href: "https://linkerpink.itch.io/the-royal-spin",
    github: "https://github.com/MarkBSH/Suicide-Squad",

    technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

    media: [
      { type: "image", src: "/images/the royal spin logo.png" },
      { type: "image", src: "/images/trs 1.jpg" },
      { type: "image", src: "/images/trs 2.jpg" },
      { type: "image", src: "/images/trs 3.jpg" },
      { type: "image", src: "/images/trs 4.jpg" },
      { type: "image", src: "/images/trs 5.jpg" },
      { type: "youtubeId", src: "T5x7aK-R4FY", title: "Gameplay Video" },
    ],

    featured: true,

    codeSnippets: [
{
	name: "SettingsManager.cs",
	language: "C#",
	description: "This is the script that manages player settings. The current player settings and default player settings are stored in a Scriptable Object, that then gets loaded when the game loads a scene.",
	code: `
private void Start()
{
	LoadPlayerSettings();

	if (playerSettings.fieldOfView < 10)
	{
		LoadDefaultSettings();
	}
}

private void FindObjects()
{
	m_playerCam = FindAnyObjectByType<FirstPersonCam>();
	if (m_playerCam != null)
	{
		m_playerCam.m_MouseSensitivity = playerSettings.mouseSensitivity;
		m_playerCam.GetComponent<Camera>().fieldOfView = playerSettings.fieldOfView;
	}
}

public void ChangeViewBobbing()
{
	playerSettings.viewBobbingEnabled = m_viewBobbingSlider.value;
	UpdateSettingsUI();
	SavePlayerSettings();
}

public void ChangeMouseSens(float _value)
{
	playerSettings.ChangeMouseSensitivity(_value);
	UpdateSettingsUI();
	SavePlayerSettings();
}

public void ChangeCameraFOV(float _value)
{
	playerSettings.ChangeFieldOfView(_value);
	UpdateSettingsUI();
	SavePlayerSettings();
}

public void LoadDefaultSettings()
{
	ChangeMouseSens(defaultSettings.mouseSensitivity);
	ChangeCameraFOV(defaultSettings.fieldOfView);

	SavePlayerSettings();
	UpdateSettingsUI();
}

public void UpdateSettingsUI()
{
	m_mouseSensText.SetText("Mouse Sensitivity: " + playerSettings.mouseSensitivity.ToString());
	m_mouseSensSlider.value = playerSettings.mouseSensitivity;

	m_camFOVText.SetText("Camera Field Of View: " + playerSettings.fieldOfView.ToString());
	m_camFOVSlider.value = playerSettings.fieldOfView;
	
	// m_viewBobbingText.SetText("View Bobbing: " + playerSettings.viewBobbingEnabled.ToString());
	// m_viewBobbingSlider.value = playerSettings.viewBobbingEnabled;
}

public void SavePlayerSettings()
{
	PlayerPrefs.SetFloat("Mouse Sensitivity", playerSettings.mouseSensitivity);
	PlayerPrefs.SetFloat("Field Of View", playerSettings.fieldOfView);
	//PlayerPrefs.SetFloat("View Bobbing Enabled", playerSettings.viewBobbingEnabled);
	PlayerPrefs.Save();

	FindObjects();
}

public void LoadPlayerSettings()
{
	if (PlayerPrefs.HasKey("Mouse Sensitivity"))
	{
		playerSettings.mouseSensitivity = PlayerPrefs.GetFloat("Mouse Sensitivity");
	}
	else
	{
		PlayerPrefs.SetFloat("Mouse Sensitivity", defaultSettings.mouseSensitivity);
		playerSettings.mouseSensitivity = PlayerPrefs.GetFloat("Mouse Sensitivity");
	}

	if (PlayerPrefs.HasKey("Field Of View"))
	{
		playerSettings.fieldOfView = PlayerPrefs.GetFloat("Field Of View");
	}
	else
	{
		PlayerPrefs.SetFloat("Mouse Sensitivity", defaultSettings.mouseSensitivity);
		playerSettings.fieldOfView = PlayerPrefs.GetFloat("Field Of View");
	}
}
	`
},

{
	name: "GameManager.cs",
	language: "C#",
	description: "This is the GameManager script that can pause the game, locks / unlocks cursor and displays the items in the player's inventory at that moment ",
	code: `
#region Common GameManager Functions

public void ChangeScene(string _scene)
{
	SceneManager.LoadScene(_scene);
}

public void LockCursor()
{
	Cursor.lockState = CursorLockMode.Locked;
}

public void UnlockCursor()
{
	Cursor.lockState = CursorLockMode.None;
}

public void EnablePause()
{
	if (FindAnyObjectByType<PlayerInteracting>())
	{
		m_playerInteracting = FindAnyObjectByType<PlayerInteracting>();
	}

	if (currentScene != "Main Menu" && !m_playerInteracting.m_IsInteracting)
	{
		if (!paused)
		{
			PauseGame();
		}
		else
		{
			UnpauseGame();
		}
	}
}

public void PauseGame()
{
	paused = true;
	Time.timeScale = 0;

	if (UIManager.Instance.pauseUI != null)
	{
		UIManager.Instance.pauseUI.SetActive(true);
	}

	UnlockCursor();
}

public void UnpauseGame()
{
	paused = false;
	Time.timeScale = 1;

	if (UIManager.Instance.pauseUI != null)
	{
		UIManager.Instance.pauseUI.SetActive(false);
	}

	LockCursor();
}

#endregion

#region Shop & Items

public void BuyItem(Item _item)
{
	if (money >= _item.itemCost)
	{
		// Look if the player has the item and if it's allowed to have duplicates of the same time in the inventory
		if (items.ContainsKey(_item) && !_item.duplicatesAllowed)
		{
			Debug.Log("Can only buy one of this item");
		}
		else
		{
			// Buy Item
			if (_item.itemType == Item.ItemType.Default)
			{
				AddItem(_item);
			}
			else if (_item.itemType == Item.ItemType.SpellPack)
			{
				RandomSpellGiver.Instance.SetupSpellGiver();
			}
			else if (_item.itemType == Item.ItemType.Alchohol)
			{
				FindAnyObjectByType<DrunkEffect>().Drink();
			}

			RemoveMoney(_item.itemCost);
		}
	}
	else
	{
		Debug.Log("Not enough money");
	}
}

public void AddItem(Item _item)
{
	if (!items.ContainsKey(_item))
	{
		items.Add(_item, 0);
	}
	else
	{
		items[_item]++;
	}

	UpdateItemUI();
}

public void RemoveItem(Item _item)
{
	if (items.ContainsKey(_item))
	{
		if (items[_item] > 0)
		{
			items[_item]--;
		}
		else
		{
			items.Remove(_item);
		}
	}
	else
	{
		Debug.LogError($"Trying to remove an item that doesn't exist in the items dictionary :( Item name: {_item.name}");

		foreach (var kvp in items)
		{
			Debug.Log($"Inventory item: {kvp.Key.name} x{kvp.Value}");
		}
	}


	UpdateItemUI();
}

public Item TryGetItem(string _name)
{
	bool _found = false;

	foreach (Item _item in items.Keys)
	{
		if (_item.name == _name && !_found)
		{
			_found = true;
			return _item;
		}
	}

	return null;
}

public void EnableShopUI()
{
	m_shopManager.shopUI.SetActive(true);

	UnlockCursor();
}

public void DisableShopUI()
{
	m_shopManager = FindAnyObjectByType<ShopManager>();
	m_shopManager.shopUI.SetActive(false);

	if (RandomSpellGiver.Instance.m_spellScreenActive == false)
	{
		LockCursor();
	}
}

private void UpdateItemUI()
{
	if (m_itemUI != null)
	{
		foreach (Transform _child in m_itemUI.transform)
		{
			// Make sure there are no item icons left
			Destroy(_child.gameObject);
		}

		foreach (Item _item in items.Keys)
		{
			if (_item.itemType != Item.ItemType.SpellPack)
			{
				GameObject _itemIconObject = Instantiate(m_itemIconPrefab);
				_itemIconObject.transform.SetParent(m_itemUI.transform);

				Image _itemIcon = _itemIconObject.GetComponent<Image>();
				_itemIcon.sprite = _item.itemIcon;

				TextMeshProUGUI _itemAmountText = _itemIconObject.GetComponentInChildren<TextMeshProUGUI>();

				int _amount;

				if (items.ContainsKey(_item))
				{
					_amount = items[_item] + 1;
				}
				else
				{
					_amount = 0;
				}

				_itemAmountText.SetText(_amount.ToString());
			}
		}
	}
	else
	{
		Debug.LogError("Item UI not found!");
	}
}

private IEnumerator DisableShopUICoroutine()
{
	yield return new WaitForSeconds(0.25f);
	DisableShopUI();
}

#endregion
	`
},

{
	name: "RussianRoulette.cs",
	language: "C#",
	description: "This is the script for handling russian roulette. Some of the functions are used in animations as events.",
	code: `
public void StartRussianRouletteSetup()
{
	if (!playedRoulette)
	{
		m_animator.SetTrigger("Start Russian Roulette Intro");
		m_interactableCameras.EnableCamera();
		completedRussianRouletteSetup = false;
	}
	
	m_tableGun.SetActive(false);
	AudioManager.Instance.Stop("bg music");
	AudioManager.Instance.Play("piano slam");
	AudioManager.Instance.Play("heart beat");
}

public void CompleteRussianRouletteSetup()
{
	completedRussianRouletteSetup = true;
	m_ableToCloseRoulette = true;
}

public void StartRussianRoulette()
{
	if (!playedRoulette)
	{
		FindAnyObjectByType<PlayerStartInteract>().ClearControlsUIHolder();

		int _rnd = 1;
		if (!GameManager.Instance.m_IsInstaWin)
		{
			_rnd = Random.Range(0, 5);
		}
		else
		{
			GameManager.Instance.m_IsInstaWin = false;
		}

		if (_rnd == 0)
		{
			RouletteDeath();
		}
		else
		{
			RouletteWin();
		}

		completedRussianRouletteSetup = true;
		m_ableToCloseRoulette = false;
	}
}

public void CloseRussianRoulette()
{
	if (completedRussianRouletteSetup && m_ableToCloseRoulette)
	{
		if (GetComponentInChildren<InteracteblesCameras>())
		{
			GetComponentInChildren<InteracteblesCameras>().DisableCamera();
		}

		completedRussianRouletteSetup = false;
		print("closed Russian Roulette");

		m_txt = "";

		m_animator.SetTrigger("Close Russian Roulette");

		AudioManager.Instance.Play("bg music");
		AudioManager.Instance.Stop("heart beat");
		m_tableGun.SetActive(true);
	}
}

private void RouletteDeath()
{
	m_animator.SetTrigger("Roulette Death");

	// Destroy object instead of set active, caused weird interact issues
	Destroy(GetComponentInChildren<BoxCollider>().gameObject);
	FindAnyObjectByType<PlayerInteracting>().m_InteractLink = null;
	playedRoulette = true;
}

private void RouletteWin()
{
	m_animator.SetTrigger("Win Russian Roulette");

	// Destroy object instead of set active, caused weird interact issues
	Destroy(GetComponentInChildren<BoxCollider>().gameObject);
	playedRoulette = true;
}

public void RouletteWinEvent()
{
	CloseRussianRoulette();
	print(hasSeenEscapeSequence);

	if (!hasSeenEscapeSequence)
	{
		if (FindAnyObjectByType<PlayerInteracting>())
		{
			FindAnyObjectByType<PlayerInteracting>().StartCoroutine(FindAnyObjectByType<PlayerInteracting>().CloseCoolDown(0f));
		}

		hasSeenEscapeSequence = true;
		FindAnyObjectByType<PlayerInteracting>().m_InteractLink = null;
		FindAnyObjectByType<PlayerStartInteract>().CreateControlsUI("B", "- Spell Book", false);
		m_gameManager.ChangeCamera(playerCamera, escapeCamera, escapeCamera.transform.position, escapeCamera.transform.rotation, escapeCamera.fieldOfView);
		GameObject.FindWithTag("EntranceDoorTrigger").GetComponent<Animator>().SetTrigger("doorOpen");
		AudioManager.Instance.Stop("heart beat");
		StartCoroutine(GoToEnding(7.5f));
	}
}

public void RouletteDeathEvent()
{
	FindAnyObjectByType<FirstPersonMovement>().Die();
	AudioManager.Instance.Stop("heart beat");
}

private IEnumerator GoToEnding(float _delay)
{
	yield return new WaitForSeconds(_delay);
	SceneManager.LoadScene("Main Menu");
}
	`
},

{
	name: "AudioManager.cs",
	language: "C#",
	description: "This is the script that handles the functions for sounds. It is based on the simple sound system I made for my game: Shy.",
	code: `
private void OnSceneLoaded(Scene scene, LoadSceneMode mode)
{ 
	foreach(Sound s in sounds)
	{
		s.source = gameObject.AddComponent<AudioSource>();
		s.source.clip = s.clip;

		s.source.volume = s.volume;
		s.source.pitch = s.pitch;
		s.source.loop = s.loop;
	}
}

public void Play(string _name)
{
	Sound s = Array.Find(sounds, sound => sound.name == _name);
	if (s == null) 
	{
		Debug.LogWarning("Sound: " + name + " not found!");
		return;
	}
	s.source.Play();
}

public void Stop(string _name)
{
	Sound s = Array.Find(sounds, sound => sound.name == _name);
	if (s == null) 
	{
		Debug.LogWarning("Sound: " + name + " not found!");
		return;
	}
	s.source.Stop();
}

public void StopAll()
{
	foreach (Sound s in sounds)
	{
		s.source.Stop();
	}
}

public void SetVolume(float _volume, string _name)
{
	Sound s = Array.Find(sounds, sound => sound.name == _name);
	if (s == null) 
	{
		Debug.LogWarning("Sound: " + name + " not found!");
		return;
	}
	s.source.volume = _volume;
}
	`
},

    ],
  },

  // When Time Colldes //
  {
    title: "When Time Collides",
    slug: "when-time-collides",
    banner: "/images/when time collides.webp",
    icon: "/images/when time collides.webp",
    date: "2022-03-18",
    displayDate: formatDisplayDate("2022-03-18"),
    platform: "GX Games",
    imgSrc: "/images/when time collides.webp",
    href: "https://gx.games/games/ef2jjg/when-time-collides/",

    description:
      "When Time Collides is a small retro platformer made for the GameMaker Studio GameJam 2022 where you have to parkour your way through multiple levels while being able to controll time. But what does switching the time do? Are there any enemies? Find out while playing yourself. \n\nDeveloper: \nNoah (Linkerpink) \n\nArtists: \nLuca (SupercatLuigi Player) \nBelle \n\n What I made: \n- Player Movement \n- Player Interaction \n- Player Camera \n- Time Switching Mechanic \n- Textbox System \n- Tutorial Dummy with easter eggs \n- Boss Fight \n\nI lost the most up to date version of the source code. I used Google Drive, because I didn't know what Git was at the time. So the most up to date version of the source code may differ from the build that is playable online.",

    technologies: ["/images/gamemaker studio logo.svg"],

    media: [
      { type: "image", src: "/images/when time collides.webp" },
      { type: "image", src: "/images/wtc 1.webp" },
      { type: "image", src: "/images/wtc 2.webp" },
      { type: "image", src: "/images/wtc 3.webp" },
      { type: "youtubeId", src: "qTu8QpEhT8A", title: "Gameplay Video" },
      {
        type: "youtubeId",
        src: "zdwZJZxRDiE",
        title: "The Making Of When Time Collides",
      },
    ],

    featured: true,

    codeSnippets: [
{
	name: "PlayerObject: Step",
	language: "GML",
	description: "This is the Step event of the player object. It handles the player movement, time switching and attacking.",
	code: `
//day and night switching
timekey = keyboard_check_pressed (ord("C"))// or (gamepad_button_check_pressed(0, gp_face3));
attackkey = keyboard_check_pressed(ord("X"))

if cancontrol = true
{
	if timekey and day == true
	{
		cancontrol = false;
		sprite_index = PlayerSpriteSlash;
		audio_play_sound(TimeChangeSound,3,false);
		ScreenShake(10,20);
		alarm[0] = 20;
	}
	
	if timekey and day == false
	{
		cancontrol = false;
		sprite_index = PlayerSpriteSlash;
		audio_play_sound(TimeChangeSound,3,false);
		ScreenShake(10,20);
		alarm[1] = 20;
	}
	//attacking
	if attackkey == true
	{
		cancontrol = false;
		sprite_index = PlayerSpriteSlash;
		alarm[2] = 20;
	}
}


if day == true
{
	grav = 0.4;
	if (cancontrol)
	{
		leftkey = keyboard_check(vk_left)// or (gamepad_button_check(0, gp_padl));
		rightkey = keyboard_check(vk_right)// or (gamepad_button_check(0, gp_padr));
		jumpkey = keyboard_check_pressed (vk_space)// or (gamepad_button_check_pressed(0, gp_face1));

		var move = rightkey - leftkey;

		horispeed = move * walkspeed;
		// left and right movement
		//horizontal collisions
		if (place_meeting(x+horispeed,y,ObstacleObject))
		{
		while (!place_meeting(x+sign(horispeed),y,ObstacleObject))
		{
			x = x + sign(horispeed);
		}
			horispeed = 0;
		}

		x = x + horispeed;

		// jumping
		vertispeed = vertispeed + grav;

		if (place_meeting(x ,y+1,ObstacleObject)) and (jumpkey)
		{
		    vertispeed = -8;
			audio_play_sound(JumpSound,5,false);
		}

		//vertical collisions
		if (place_meeting(x, y+vertispeed,ObstacleObject))
		{
		   while (!place_meeting(x, y+sign(vertispeed), ObstacleObject))
		   {
		    y = y + sign(vertispeed);
		   }
		    vertispeed = 0;
		}

		y = y + vertispeed;

		// animations :))))))))))))))))))))

		image_speed = 1;
		// standing animation
		if (horispeed == 0)
		{
			sprite_index = PlayerSprite;
		}
		// running animation
		else 
		{
			sprite_index = PlayerSpriteRun;
		}

		//jumping animation
		if !(place_meeting(x ,y+1,ObstacleObject)) {sprite_index = PlayerSpriteJump;}

		if (horispeed !=0) image_xscale = sign (horispeed);
		image_yscale = 1;

		// you are dead not a big suprise
		if hp == 0 
		{
			room_restart();
		}

		// damage taken (you nooby gamer)
		invincable = max(invincable-1,0);
	}
	else
	{
		rightkey = 0;
		leftkey = 0;
		jumpkey = 0;
	}
}

if day == false
{
	grav = 0.1;
	if (cancontrol)
	{
	leftkey = keyboard_check(vk_left)// or (gamepad_button_check(0, gp_padl));
	rightkey = keyboard_check(vk_right)// or (gamepad_button_check(0, gp_padr));
	jumpkey = keyboard_check_pressed (vk_space)// or (gamepad_button_check_pressed(0, gp_face1));

	var move = rightkey - leftkey;

	horispeed = move * walkspeed;
	// left and right movement
	//horizontal collisions
	if (place_meeting(x+horispeed,y,ObstacleObject))
	{
	while (!place_meeting(x+sign(horispeed),y,ObstacleObject))
	{
		x = x + sign(horispeed);
	}
		horispeed = 0;
	}

	x = x + horispeed;

	// jumping
	vertispeed = vertispeed - grav;

	if (place_meeting(x ,y-8,ObstacleObject)) and (jumpkey)
	{
	    vertispeed = +4;
		audio_play_sound(JumpSound,5,false);
	}

	//vertical collisions
	if (place_meeting(x, y+vertispeed -4,ObstacleObject))
	{
	   while (!place_meeting(x, y+sign(vertispeed), ObstacleObject))
	   {
	    y = y + sign(vertispeed);
	   }
	    vertispeed = 0;
	}

	y = y + vertispeed;

	// animations :))))))))))))))))))))

	image_speed = 1;
	// standing animation
	if (horispeed == 0) 
	{
		sprite_index = PlayerSprite;
	}
	// running animation
	else 
	{
		sprite_index = PlayerSpriteRun;
	}

	//jumping animation
	if !(place_meeting(x, y+vertispeed -4,ObstacleObject)) {sprite_index = PlayerSpriteJump;}

	if (horispeed !=0) image_xscale = sign (horispeed);
	image_yscale = -1;

	// you are dead not a big suprise
	if hp == 0 
	{
		room_restart();
	}

	// damage taken (you nooby gamer)
	invincable = max(invincable-1,0);
	}
	else
	{
		rightkey = 0;
		leftkey = 0;
		jumpkey = 0;
	}
}

if instance_exists(TextObject) {image_index = PlayerSprite;}
	`
},

{
	name: "CameraObject: Step",
	language: "GML",
	description: "This is the step event of the CameraObject that handles the camera movement, following the player, and screenshake effects.",
	code: `
// cam update
if (instance_exists(follow))
{
	gotoX = follow.x;
	gotoY = follow.y;
}

// object update
x += (gotoX - x) / smooth;
y += (gotoY - y) / smooth;

//keep cam in room else the players see oudside the room that's not what you would want to see in geam
x = clamp(x,w_half_view+buffer,room_width-w_half_view-buffer);
y = clamp(y,h_half_view+buffer,room_height-h_half_view-buffer);

//screenshake
x += random_range(-shake_remain,shake_remain);
y += random_range(-shake_remain,shake_remain);
shake_remain = max(0,shake_remain-((1/shake_length)*shake_strong));

// update camera view
camera_set_view_pos(cam,x-w_half_view,y-h_half_view);

if room = MainGameRoom5
{
	if instance_exists(TextObject)
	{
		smooth = 10;
		follow = BossObjectIntro;
	}
}
if room = MainGameRoom5
{
	if !instance_exists(TextObject)
	{
		smooth = 1;
		follow = PlayerObject;
	}
}
	`
},

{
	name: "TextObject: Draw",
	language: "GML",
	description: "This is the Draw event of the TextObject that displays text on the screen. It handles the textbox, text speed, and page flipping.",
	code: `
accept_key = keyboard_check_pressed(vk_space);

textbox_x = camera_get_view_x(view_camera[0]) +200;
textbox_y = camera_get_view_y(view_camera[0]) +80;

if text_length !=0
{
	PlayerObject.cancontrol = false;
}
if text_length == 0
{
	PlayerObject.cancontrol = true;
}
//setup
if (setup == false)
{
	setup = true;
	draw_set_font(NormalFont);
	draw_set_valign(fa_top);
	draw_set_halign(fa_left);
	
	//loop trough pages
	for (var p = 0; p < page_number; p++)
	{
		text_length[p] = string_length(text[p]);
		
		//no character talking
		text_x_offset[p] = 44;
		
		//where should the text break? good question
	}
}

//typing the text
if(draw_char < text_length[page])
{
	draw_char += text_speed;
	draw_char = clamp(draw_char, 0, text_length[page]);
}


//flip trough pages
if (accept_key)
{
	//if typing is done
	if (draw_char == text_length[page])
	{
		//next page
		if (page < page_number-1)
		{
			page++;
			draw_char = 0;
		}
		//destroy textbox
		else
		{
			PlayerObject.cancontrol = true;
			instance_destroy();
		}
	}
	//if typing is not done
	else
	{
		draw_char = text_length[page];
	}
}

//draw textbox
txtb_img += txtb_img_speed;
txtb_spr_w = sprite_get_width(txtb_spr);
txtb_spr_h = sprite_get_height(txtb_spr);
//back of textbox
draw_sprite_ext(txtb_spr,txtb_img,textbox_x + text_x_offset[page],textbox_y,textbox_width/txtb_spr_w,textbox_height/txtb_spr_h,0,c_white,1);

//draw the text
var c = 0;
//sfx
//floating text
var _float_y = 0;
if float_text[c, page] == true
{
	float_dir[c, page] += -6;
	_float_y = dsin(float_dir[c, page]);
}

var _drawtext = string_copy(text[page],1,draw_char);
draw_text_ext_color(textbox_x - text_x_offset[page] -70 + border, textbox_y + _float_y + border -70, _drawtext, line_sep, line_width, col_1[c, page], col_2[c, page], col_3[c, page], col_4[c, page], 1);
	`
},

{
	name: "GameTextScript.gml",
	language: "GML",
	description: "This is the script that holds all the dialogue for the game. It is used by the TextObject to display text on the screen when needed.",
	code: `
/// param text_id
function scr_game_text(_text_id) 
{
	switch(_text_id)
	{
		case "sign1":
		scr_text("Press the spacebar on the keyboard to jump.")
		break;
		
		case "sign2":
		scr_text("Press C on the keyboard to change the time.");
		break;
		
		case "sign3":
		scr_text("In the night the gravity is lower. Try to switch between day and night often.");
		break;
		
		case "sign4":
		scr_text("Watch out spikes ahead!");
		break;
		
		case "dummy1":
		scr_text("Hello there. I'm a dummy. You can practice combat on me. Use X on the keyboard to attack.");
		break;
		
		case "dummy2":
		scr_text("I think that's enough practicing for now.");
		break;
		
		case "dummy3":
		scr_text("Uhm please stop it's hurting.");
		break;
		
		case "dummy4":
		scr_text("Please stop.");
		break;
		
		case "dummy5":
		scr_text("STOP!");
		break;
		
		case "dummy6":
		scr_text("IT'S HURTING STOP!");
		break;
		
		case "dummy7":
		scr_text("Ok I think you just don't have feelings for others or something.");
		break;
		
		case "dummy8":
		scr_text("Would you like it if you got hit in the face about 70 times?");
		scr_text("I think not.");
		break;
		
		case "dummy9":
		scr_text("You're starting to annoy me a bit.");
		break;
		
		case "dummy10":
		scr_text("I'm asking you again");
		scr_text("please");
		scr_text("STOP!");
		break;
		
		case "dummy11":
		scr_text("You're starting to annoy me a bit.");
		break;
		
		case "dummy12":
		scr_text("Don't you have anything better to do?");
		break;
		
		case "dummy13":
		scr_text("Wait I have an idea!");
		scr_text("You're annoying me but what if I start to be annoying.");
		break;
		
		case "dummy14":
		scr_text("HAHAHAHAHAHA why are you still not giving up?");
		break;
		
		case "dummy15":
		scr_text("Ok.... It's still not working.");
		scr_text("What if I start to say some random things to annoy you.");
		break;
		
		case "dummy16":
		scr_text("I found the perfect wikihow for you!");
		scr_text("How to be annoying wikihow.");
		break;
		
		case "dummy17":
		scr_text("Do you know SoupDuckVPN?");
		scr_text("It's the best VPN ever!");
		scr_text("Stay safe online and use SoapDuckVPN.");
		break;
		
		case "dummy18":
		scr_text("The funny thing is that SoapDuckVPN doesn't even exist!");
		scr_text("HAHAHAHAHAHA HAHAHAHAHA HAHAHAHAHAHAHA");
		scr_text("HAHAHAHAHAHA HAHAHAHAHA HAHAHAHAHAHAHA");
		scr_text("HAHAHAHAHAHA HAHAHAHAHA HAHAHAHAHAHAHA");
		scr_text("HAHAHAHAHAHA HAHAHAHAHA HAHAHAHAHAHAHA");
		break;
		
		case "dummy19":
		scr_text("In the beginning god created the heavens and the earth.");
		scr_text("And the earth was waste and void and darkness was apon the face of the deep and the spirit of God moved upon the face of the waters.");
		scr_text("Then god said, let there be light");
		break;
		
		case "dummy20":
		scr_text("..... ... . . .... . .... .... .... ... .....");
		scr_text(".");
		scr_text(".");
		scr_text(".");
		scr_text(".");
		scr_text(".");
		scr_text(".");
		scr_text(".");
		scr_text(".");
		scr_text(".");
		scr_text(".");
		break;
		
		case "dummy21":
		scr_text("Go tauch grass or something.");
		break;
		
		case "boss1":
		scr_text("You....")
		scr_text("You shouldnt have this power")
		scr_text("It's mine, give me that staff!")
		break;
	}
}
	`
},

{
	name: "BossObject",
	language: "GML",
	description: "These are the scripts for the boss fight. The boss has a very simple AI that chooses a random numver every second. if it's 0, it will attack the player with fireballs. If it's another number it will move either up, down, left or right",
	code: `
Create:
bosshp = 100;
boss_hp_max = bosshp;
global.bossdead = false;

healthbar_width = 100;
healthbar_height = 26;
healthbar_x = 120 //(480/2) - (healthbar_width/2);
healthbar_y = CameraObject.y -250;

moving = 0;
alarm[0] = 100;
alarm[1] = 60;
/*
move 0 = attack
move 1 = move right
move 2 = move left
move 3 = move down
move 4 = move up
*/
instance_create_layer(PlayerObject.x,PlayerObject.y,layer,MusicObject)

Step:
if moving == 0
{
	//alarm 1
}
if moving == 1
{
	x ++;
}
if moving == 2
{
	x --;
}
if moving == 3
{
	y--;
}
if moving == 4
{
	y++;
}

if bosshp <= 0
{
	global.bossdead = true;
	instance_destroy();
}

Draw GUI:
draw_sprite(HealthBarBackgroundSprite,0,healthbar_x,healthbar_y);
draw_sprite_stretched(HealthBarSprite,0,healthbar_x -2,healthbar_y,(bosshp/boss_hp_max) * healthbar_width +1, healthbar_height);
draw_sprite(HealthBarBorderSprite,0,healthbar_x,healthbar_y);

draw_set_font(NormalFont);
draw_set_halign(fa_left);
draw_set_valign(fa_center);
draw_set_color(c_black);
draw_text(healthbar_x +20, healthbar_y -15,"Boss");

var offset = 2;
draw_set_color(c_white);
draw_text(healthbar_x +20 -offset, healthbar_y -15 -offset,"Boss");

alarm 0:
randomize();
moving = irandom_range(0,4);

alarm[0] = 100;

alarm 1:
if moving == 0 and PlayerObject.day == true
{
	instance_create_layer(x,y,layer,FireballObject);
}
alarm[1] = 60;
	`
},

    ],
  },

  // Portfolio Website //
  {
    title: "Portfolio Website",
    slug: "portfolio-website",
    banner: "/images/portfolio site cover temp.png",
    icon: "/images/portfolio site cover temp.png",
    date: "2025-07-23",
    displayDate: formatDisplayDate("2025-07-23"),
    imgSrc: "/images/portfolio site cover temp.png",
    platform: "Web",

    github: "https://github.com/Linkerpink/linkerpink.github.io",

    description: "This is the website you are currently looking at. It is made with Next.js, TypeScript, and Tailwind CSS. It is a portfolio website that showcases my development projects, skills, and experiences. The site includes some easter eggs, Good luck finding them all :) \n\nThe design of the website is based off the Nintendo Wii U eshop design, Wii U Operating System design and Nintendo Switch eshop design, modified to my own liking. I chose for this type of design because Nintendo has always had great designs for their consoles. The Wii U is my favorite console and defined a big part of my youth and life. \n\nWhat I made: \n- Home Page \n- All Projects Page \n- Project Details Page \n- Re usable Project component \n- Re usable Code Snippet component \n- Theme Support \n- Responsive design \n- Sleek Animations \n- Easter Eggs",

    technologies: [
      "/next.svg",
      "/images/typescript logo.svg",
      "/images/tailwind css logo.svg",
    ],

    media: [{ type: "image", src: "/images/portfolio site cover temp.png" }],

    featured: true,

    codeSnippets: [
      {
        name: "insane script",
        language: "tsx",
        description: "ik was beter.",
        code: `insane code`,
      },
    ],
  },

  // Shy //
  {
    title: "Shy",
    slug: "shy",
    banner: "/images/SHYGame.jpg",
    icon: "/images/SHYGame.jpg",
    date: "2024-05-26",
    displayDate: formatDisplayDate("2024-05-26"),
    href: "https://linkerpink.itch.io/shy/",
    github: "https://github.com/GLU-CSD/shy-Linkerpink",
    imgSrc: "/images/SHYGame.jpg",
    platform: "Itch.io",

    description: "Shy is a stealth game where you need to get keys and try to escape while not getting cought by the guards. Press B to emote. \n\nWhat I made: \n- Emote wheel. \n- GameManager \n- Audio System \n- Player \n- Guards \n- Keys & Doors",

    technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

    media: [{ type: "image", src: "/images/SHYGame.jpg" }],

    featured: true,

    codeSnippets: [
      {
	name: "EmoteWheel.cs",
	language: "C#",
	description: "This is the script that handles the emote wheel. Most of it is made in unity's canvas.",
	code: `
void Update()
{
	if (Input.GetKeyDown(KeyCode.B))
	{
		ChangeEnableEmoteWheel();
	}

	if (enableEmoteWheel)
	{
		//GetComponent<CanvasGroup>().alpha = 1f;
		wheel.transform.localScale = Vector3.Lerp(wheel.transform.localScale, Vector3.one, 0.05f);
		gameManager.ChangeCamera(gameManager.freeLookCam, gameManager.playerCam);

		//animator.SetBool("animateIn", false);
	}
	else
	{
		//GetComponent<CanvasGroup>().alpha = 0f;
		wheel.transform.localScale = Vector3.zero;

		//animator.SetBool("animateIn", false);
	}
}

public void ChangeEnableEmoteWheel()
{
	if (canChangeEmoteWheel)
	{
		if (!gameManager.gamePaused)
		{
			enableEmoteWheel = !enableEmoteWheel;

			if (enableEmoteWheel)
			{
				player.canMove = false;
			}else
			{
				player.canMove = true;
			}
		}
	}   
}
	`
},

{
	name: "Emote.cs",
	language: "C#",
	description: "This is the script for making the player emote when they have selected an emote from the wheel, and then changes the camera acordingly",
	code: `
public void EmoteDab()
{
	if (emoteWheel.enableEmoteWheel)
	{
		if (!isEmoting)
		{
			emoteWheel.ChangeEnableEmoteWheel();
			StartCoroutine(EmoteTimer(1f, emoteCam));

			animator.SetTrigger("emoteDab");
			audioManager.Play("Dab");

			gameManager.ChangeCamera(playerCam, emoteCam);
		}
	}
}

public void EmoteFlippinSexy()
{
	if (emoteWheel.enableEmoteWheel)
	{
		if (!isEmoting) 
		{
			emoteWheel.ChangeEnableEmoteWheel();
			StartCoroutine(EmoteTimer(3f, emoteCam));

			animator.SetTrigger("emoteFlippinSexy");

			gameManager.ChangeCamera(playerCam, emoteCam);
		}
	}
}

public void EmoteDance()
{
	if (emoteWheel.enableEmoteWheel)
	{
		if (!isEmoting)
		{
			emoteWheel.ChangeEnableEmoteWheel();
			StartCoroutine(EmoteTimer(2f, emoteCam));

			animator.SetTrigger("emoteDance");

			gameManager.ChangeCamera(playerCam, emoteCam);
		}
	}
}

public void EmoteSalute()
{
	if (emoteWheel.enableEmoteWheel)
	{
		if (!isEmoting)
		{
			emoteWheel.ChangeEnableEmoteWheel();
			StartCoroutine(EmoteTimer(1f, emoteCam));

			animator.SetTrigger("emoteSalute");

			gameManager.ChangeCamera(playerCam, emoteCam);
		}
	}
}

public void EmoteDefaultDance()
{
	if (emoteWheel.enableEmoteWheel)
	{
		if (!isEmoting)
		{
			emoteWheel.ChangeEnableEmoteWheel();
			StartCoroutine(EmoteTimer(5f, emoteCam));

			animator.SetTrigger("emoteDefaultDance");

			audioManager.Play("Default Dance");

			gameManager.ChangeCamera(playerCam, emoteCam);
		}
	}
}

public void EmoteGriddy()
{
	if (emoteWheel.enableEmoteWheel)
	{
		if (!isEmoting)
		{
			emoteWheel.ChangeEnableEmoteWheel();
			//StartCoroutine(EmoteTimer(7f, emoteCam));

			animator.SetTrigger("emoteGriddy");

			audioManager.Play("Griddy");

			//gameManager.ChangeCamera(playerCam, emoteCam);
		}
	}
}

public void EmoteSus()
{
	if (emoteWheel.enableEmoteWheel)
	{
		if (!isEmoting)
		{
			animator.SetTrigger("emoteSus");
			emoteWheel.ChangeEnableEmoteWheel();
			StartCoroutine(EmoteTimer(10f, emoteCamSus));

			gameManager.ChangeCamera(playerCam, emoteCamSus);
		}
	}
}

private IEnumerator EmoteTimer(float time, CinemachineVirtualCamera cam)
{
	//Make sure the cam variable is the same as the cam you change it to
	isEmoting = true;
	emoteWheel.player.canMove = false;
	yield return new WaitForSeconds(time);
	isEmoting = false;
	emoteWheel.player.canMove = true;

	gameManager.ChangeCamera(cam, playerCam);
}
	`
},

{
	name: "GameManager.cs",
	language: "C#",
	description: "This is the GameManager script that handles the pausing of the game, camera switching, level completion and cheats",
	code: `
private void Update()
{
	if (Input.GetButtonDown("Pause"))
	{
		gamePaused = !gamePaused;
	}

	if (gamePaused)
	{
		Time.timeScale = 0.0f;
		pauseUi.enabled = true;
		
		if (Input.GetKeyDown(KeyCode.Return))
		{
			enableCheatInput = !enableCheatInput;
		}

		if (enableCheatInput)
		{
			cheatInput.SetActive(true);
		}
		else
		{
			cheatInput.SetActive(false);
		}
	}
	else
	{
		Time.timeScale = 1.0f;
		pauseUi.enabled = false;
		enableCheatInput = false;
	}

	if (levelCompleted)
	{
		StartCoroutine(LevelCompleted());
	}
}

public void ChangeCamera(CinemachineVirtualCamera oldCam, CinemachineVirtualCamera cam)
{
	oldCam.Priority = 0;
	cam.Priority = 10;
}

public void CheckInput(string s)
{

	input = cheatInput.GetComponent<TMP_InputField>().text;
	Debug.Log(input);
	if (input == "enable cheats")
	{
		enableCheats = true;
		Debug.Log("Cheats enabled");
	}

	if (input == "disable cheats")
	{
		enableCheats = false;
		Debug.Log("Cheats disabled");
	}
}

public IEnumerator LevelCompleted()
{
	winText.SetActive(true);
	yield return new WaitForSeconds(5f);
	SceneManager.LoadScene("Main Menu");
	levelCompleted = false;
}
	`
},

{
	name: "AudioManager.cs",
	language: "C#",
	description: "This is a simple AudioManager for playing sounds in the game. The sounds array should be set in the unity editor and should contain every audio in the game with the correct naming.",
	code: `
public Sound[] sounds;

private void Awake()
{
	foreach(Sound s in sounds)
	{
		s.source = gameObject.AddComponent<AudioSource>();
		s.source.clip = s.clip;

		s.source.volume = s.volume;
		s.source.pitch = s.pitch;
		s.source.loop = s.loop;
	}

	Play("Music");
}

public void Play(string name)
{
	Sound s = Array.Find(sounds, sound => sound.name == name);
	if (s == null) 
	{
		Debug.LogWarning("Sound: " + name + " not found!");
		return;
	}
	s.source.Play();
}
	`
},

{
	name: "PlayerMovement.cs",
	language: "C#",
	description: "This is the script for the player. It works with the Unity NavMesh and moves to a point set when clicked on the screen.",
	code: `
private void Update()
{
	cam = GameObject.Find("Main Camera").GetComponent<Camera>();

	if (Input.GetMouseButtonDown(0))
	{
		Ray ray = cam.ScreenPointToRay(Input.mousePosition);
		RaycastHit hit;

		if (Physics.Raycast(ray, out hit))
		{
			NavMeshHit navHit;
			if (NavMesh.SamplePosition(hit.point, out navHit, 1.0f, NavMesh.AllAreas))
			{
				agent.SetDestination(navHit.position);
			}
		}
	}

	agentSpeed = agent.velocity.magnitude;

	animator.SetFloat("Walking", agentSpeed);

	animator.SetFloat("sleepTimer", sleepTimer);

	if (!canMove)
	{
		agent.velocity = Vector3.zero;
		agentSpeed = 0;
	}else
	{
		if (agentSpeed > 0.1)
		{
			sleepTimer = 0;
		}
		else
		{
			sleepTimer += Time.deltaTime;
		}
	}

}

private IEnumerator Die()
{
	//Level failed
	died = true;
	canMove = false;
	emoteWheel.enableEmoteWheel = false;
	emoteWheel.canChangeEmoteWheel = false;
	dieText.enabled = true;
	animator.SetTrigger("Died");
	audioManager.Play("Gasp");

	yield return new WaitForSeconds(5f);
	SceneManager.LoadScene("Main Menu");
}

private void OnTriggerEnter(Collider other)
{
	if (other.gameObject.tag == "Enemy" && !died && !gameManager.levelCompleted)
	{
		StartCoroutine(Die());
	}
}

private void OnTriggerStay(Collider other)
{
	if (other.gameObject.tag == "Exit")
	{
		if (gameManager.doorsOpened >= 2 & !gameManager.levelCompleted)
		{
			//Level complete
			gameManager.levelCompleted = true;
			
			animator.SetTrigger("levelCompleted");
			canMove = false;
			emoteWheel.enableEmoteWheel = false;
			emoteWheel.canChangeEmoteWheel = false;
		}
	}
}
	`
},

{
	name: "Enemy.cs",
	language: "C#",
	description: "This is the script for the enemy. It also uses the Unity Navmesh. When not seeing the player, it will patrol around. When the enemy is patroling, it will choose a random point in a certain range and move to that. When it sees the player, it will chase it when in a certain range.",
	code: `
private void Update()
{
	//Check for sight and attack range
	playerInSightRange = Physics.CheckSphere(transform.position, sightRange, whatIsPlayer);

	if (!playerInSightRange)
	{
		Patroling();
	}

	if (playerInSightRange)
	{
		ChasePlayer();
	}

	if (player.died) 
	{
		agent.speed = 0;
		animator.SetTrigger("Outrage");
		transform.Rotate(playerTransform.position);
	}
}

private void Patroling()
{
	if (!walkPointSet)
	{
		SearchWalkPoint();
	}

	if (walkPointSet)
	{
		agent.SetDestination(walkPoint);
	}

	Vector3 distanceToWalkPoint = transform.position - walkPoint;

	//Walkpoint reached
	if (distanceToWalkPoint.magnitude < 1f)
	{
		walkPointSet = false;
	}
}

private void SearchWalkPoint()
{
	//Calculate random point in range
	float randomZ = Random.Range(-walkPointRange, walkPointRange);
	float randomX = Random.Range(-walkPointRange, walkPointRange);

	walkPoint = new Vector3(transform.position.x + randomX, transform.position.y, transform.position.z + randomZ);

	if (Physics.Raycast(walkPoint, -transform.up, 2f, whatIsGround))
	{
		walkPointSet = true;
	}
}

private void ChasePlayer()
{
	agent.SetDestination(playerTransform.position);
}
	`
},

    ],
  },
  
  // Open Pixel Art //
  {
    title: "Open Pixel Art",
    slug: "open-pixel-art",
    banner: "/images/open pixel art temp logo.png",
    icon: "/images/open pixel art temp logo.png",

    date: "not released",
    displayDate: formatDisplayDate("not released"),

    href: "",
    github: "https://github.com/Linkerpink/Open-Pixel-Art",

    imgSrc: "/images/open pixel art temp logo.png",
    platform: "Itch.io",

    description:
      "A free & open source pixel art tool, made with mobile in mind. \n\nThis tool was designed for my brother (Luca / SupercatLuigi Player) , who is my main artist for full release games that we want to develop. I don't want to show them on my portfolio yet. He likes working on touch devices instead of on pc, and we couldn't find a pixel art app that suited both our needs. So I made one myself.",

    technologies: [
        "/images/godot logo.svg",
        "/images/gdscript logo.webp"
    ],

    media: [
      { type: "image", src: "/images/open pixel art temp logo.png" },
    ],

    featured: false,

    codeSnippets: [
      {
        name: "fire script",
        language: "GDScript",
        description: "ik ben beter.",
        code: `insane code`,
      },
    ],
},

  // Slimetastic Punchout //
  {
    title: "Slimetastic Punchout",
    slug: "slimetastic-punchout",
    banner: "/images/slimetastic punchout cover art.png",
    icon: "/images/slimetastic punchout cover art.png",

    date: "2025-07-23",
    displayDate: formatDisplayDate("2024-12-5"),

    href: "https://nielscraft12.itch.io/slimetastic-punchout",
    github: "https://github.com/GLU-CSD/shy-Linkerpink",

    imgSrc: "/images/slimetastic punchout cover art.png",
    platform: "Itch.io",

    description:
      "Slimetastic Punchout is a chaotic and fun local multiplayer game where you take control of colorful, squishy slimes and battle it out in fast-paced arenas. The goal? Cover as many tiles as you can while sliding, bouncing, and splattering your way across the map. Along the way, you can land some solid punches to shove your opponents out of the way—or just throw them off their game. Every match is unpredictable, full of laughter, and a messy fight for control. It’s slimy chaos at its best! \n\nDevelopers: \nNiels de Laat \nNoah van Uunen \n\nArtists: \nSeemay Alsemgeest \nJordy Andriessen \nLisa van der Kloet \n\nWhat I made: \n- Player Attacking \n- Win Calculation \n- Unused Dynamic Camera \n\nThis project was made at one of my lowest points mentally. I had a lot of personal issues and didn't have motivation on anything at that moment. I thought about not including it in the: all projects section, but that would be a bit against what I was trying to acomplish with that section of the site. I want all projects I made and are sort of showcasable to be shown here. So don't expect the best from this game. Niels carried",

    technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

    media: [
      { type: "image", src: "/images/slimetastic punchout cover art.png" },
      { type: "image", src: "/images/sp 2.png" },
      { type: "image", src: "/images/sp 3.png" },
      { type: "youtubeId", src: "zgEdaaWe3JQ", title: "Launch Trailer" },
    ],

    featured: false,

    codeSnippets: [
{
	name: "GameManager.cs",
	language: "C#",
	description: "Calculate win function: Gets all the tiles in the map. All the tiles hold a variable for which player touched it last. Then there is a List of sorted scores and calculates the wins from there.",
	code: `
private void CalculateWin()
{
	canCalculate = false;
	isPerformingWin = true;

	GameObject _stageScene = GameObject.Find("Stage Scene");
	Tile[] tiles = GameObject.FindObjectsOfType<Tile>();

	// Update player scores
	for (int i = 0; i < tiles.Length; i++)
	{
		if (tiles[i].GetComponent<Tile>().lastPlayer >= 0)
		{
			playerScore[tiles[i].GetComponent<Tile>().lastPlayer] += 1;
		}
	}

	// Convert playerScore to a List and sort in descending order
	List<int> sortedScores = new List<int>(playerScore);
	sortedScores.Sort((a, b) => b.CompareTo(a));  // Sort in descending order

	// Create a list to hold player indices in sorted order
	List<int> sortedPlayerIndices = new List<int>();
	foreach (int score in sortedScores)
	{
		for (int i = 0; i < playerScore.Length; i++)
		{
			if (playerScore[i] == score && !sortedPlayerIndices.Contains(i))
			{
				sortedPlayerIndices.Add(i);
				break;
			}
		}
	}

	// Set winner (1st place)
	int _winner = sortedPlayerIndices[0];
	GameObject _winnerObject = playerArray[_winner].gameObject;
	TileColorChanger _winnerTileColorChanger = _winnerObject.GetComponent<TileColorChanger>();

	// Win text
	timerText.SetText("Player " + (_winner + 1).ToString() + " won");
	timerText.color = _winnerTileColorChanger.colors[_winnerTileColorChanger.colorSelected];
	timerText.alpha = 255;
	timerText.outlineColor = Color.black;
	timerText.outlineWidth = 0.25f;

	// Animations for winner
	// Animator _winnerAnimator = _winnerObject.GetComponentInChildren<Animator>();
	// _winnerAnimator.SetInteger("RandomWinAnimation", Random.Range(1, 2));

	// Set the winner's position (1st place)
	foreach (Transform _child in _stageScene.transform)
	{
		if (_child.name == "1st Player Position")
		{
			_winnerObject.transform.position = _child.transform.position;
		}
	}

	// Set positions for 2nd, 3rd, and 4th place players
	for (int i = 1; i < sortedPlayerIndices.Count && i < 4; i++)
	{
		int playerIndex = sortedPlayerIndices[i];
		GameObject playerObject = playerArray[playerIndex].gameObject;

		// Find the position name based on the place (2nd, 3rd, 4th)
		string positionName = $"{(i + 1)}{GetSuffix(i + 1)} Player Position";
		foreach (Transform _child in _stageScene.transform)
		{
			if (_child.name == positionName)
			{
				playerObject.transform.position = _child.transform.position;
			}
		}
	}
	Stage.SetActive(true);
	cameraManager.ChangeCamera(cameraManager.mainCam, cameraManager.winCam);
}

// Helper function to get the suffix for position numbers (1st, 2nd, 3rd, 4th)
private string GetSuffix(int number)
{
	if (number == 1) return "st";
	else if (number == 2) return "nd";
	else if (number == 3) return "rd";
	else return "th";
}
	`
},

{
	name: "PlayerAttack.cs",
	language: "C#",
	description: "The player attack works by shooting a raycast and checking if it hit another player. If it did then it gives knockback to that player. It also has a cooldown so you can't spam it.",
	code: `
private void Update()
{
	if (!gameManager.isPerformingWin)
	{
		// Handle cooldown for punches
		if (cooldown > 0)
		{
			cooldown -= Time.deltaTime;
		}

		if (punchDamageCooldown > 0)
		{
			punchDamageCooldown -= Time.deltaTime;

			RaycastHit hit;

			if (Physics.Raycast(transform.position, transform.TransformDirection(Vector3.forward), out hit, punchLength))
			{
				if (hit.transform.gameObject.CompareTag("Player"))
				{
					raycastHit = hit;
					raycastHit.transform.gameObject.GetComponent<PlayerAttack>().HitKnockback(knockbackDuration, hitDirection);
				}
			}
		}

		// Modified knockback handling
		if (knockbackTimer > 0)
		{
			knockbackTimer -= Time.deltaTime;
			if (knockbackTimer <= 0)
			{
				rb.velocity = Vector3.zero; // Stop knockback when timer ends
			}
		}
	}
}

public void OnPunch(InputAction.CallbackContext _context) // The punch input
{
	if (_context.performed && cooldown <= 0)
	{
		animator.SetTrigger("Punch");
		cooldown = cooldownValue;
		punchDamageCooldown = punchDamageCooldownValue;
		hitDirection = transform.forward; // Use actual forward direction instead of lastMoveDirection
	}
}

public void HitKnockback(float _knockbackDuration, Vector3 _hitDirection)
{
	if (knockbackTimer <= 0)
	{
		knockbackTimer = _knockbackDuration;
		rb.velocity = Vector3.zero;
		rb.AddForce(_hitDirection * knockbackStrength, ForceMode.Impulse);
		playerController.SetKnockback(true);

		// Start a coroutine to reset knockback state
		StartCoroutine(ResetKnockback(_knockbackDuration));
	}
}

private IEnumerator ResetKnockback(float duration)
{
	yield return new WaitForSeconds(duration);
	playerController.SetKnockback(false);
}
	`
},

{
	name: "CameraFollow.cs",
	language: "C#",
	description: "Dynamic camera system that gets closer or further away depending on where the players are at that moment. We didn't use it in the game, because there was a bug where sometimes it just didn't want to calculate the top. I didn't have the time and especially motivation at the time to fix it.",
	code: `
private void Update()
{
	players = gameManager.playerArray;

	if (players.Length == 0)
	{
		return;
	}

	MoveCam();
	ZoomCam();
}

private void MoveCam()
{
	Vector3 centerPoint = GetCenterPoint();

	Vector3 newPosition = centerPoint + offset;

	transform.position = Vector3.SmoothDamp(transform.position, newPosition, ref velocity, smoothTime);
}

private void ZoomCam()
{
	float newZoom = Mathf.Lerp(minZoom, maxZoom, GetGreatestDistance() / zoomLimiter);
	cam.fieldOfView = Mathf.Lerp(cam.fieldOfView, newZoom, Time.deltaTime);
}

private float GetGreatestDistance()
{
	var _bounds = new Bounds(players[0].transform.position, Vector3.zero);

	for (int i = 0; i < players.Length; i++)
	{
		_bounds.Encapsulate(players[i].transform.position);
	}

	return _bounds.size.x;
}

//This function is based of the brackeys tutorial: "MULTIPLE TARGET CAMERA in Unity"
private Vector3 GetCenterPoint()
{
	if (players.Length == 1)
	{
		return players[0].transform.position;
	}

	var _bounds = new Bounds(players[0].transform.position, Vector3.zero);

	for (int i = 0; i < players.Length; i++)
	{
		_bounds.Encapsulate(players[i].transform.position);
	}

	return _bounds.center;
}
	`
},
    ],
},

// SHMUP 2 (traumatic flashbacks) //
{
  title: "SHMUP 2",
  slug: "shmup-2",
  banner: "/images/shmup 2 banner.webp",
  icon: "/images/shmup 2 icon.webp",

  date: "2024-10-10",
  displayDate: formatDisplayDate("2024-10-10"),

  href: "https://linkeralt.itch.io/shmup-2/",
  github: "https://github.com/Linkerpink/shmup-2",

  imgSrc: "/images/shmup 2.webp",
  platform: "itch.io",

  description:
    "A simple wave based Shoot Em Up Game. \n\nScratch version: \nhttps://scratch.mit.edu/projects/1076756881/ \n\nWhat I made: \n- Wave System \n- Player \n- Pickups \n- Infinitely scrolling background \n- Scratch version",

  technologies: [
    "/images/unity logo.png",
    "/images/c sharp logo.svg",
    "/images/scratch logo.png",
  ],

  media: [{ type: "image", src: "/images/shmup 2.webp" }],

  featured: false,

  codeSnippets: [
{
	name: "WaveManager.cs",
	language: "C#",
	description: "This is the WaveManager script. It sets an initial spawnDelay between enemies spawned in a way and then starts a new wave once every enemy in a wave has been defeated. It also spawns a health pickup every time a new wave starts",
	code: `
private void Update()
{
	waveText.SetText("WAVE: " + wave);
	spawnDelay = initialSpawnDelay - (wave / 25);

	if (enemies.Count <= 0)
	{
		NewWave();
	}
}

private void NewWave()
{
	wave += 1;

	healthPickupPos = new Vector2(Random.Range(0f, 8.8f), player.transform.position.y);

	Instantiate(healthPickup, healthPickupPos, Quaternion.identity);

	StartCoroutine(SpawnEnemies());
}

private IEnumerator SpawnEnemies()
{
	for (int i = 0; i < wave; i++)
	{
		GameObject _enemy = Instantiate(enemyTypes[Random.Range(0, enemyTypes.Count)], enemySpawn);
		enemies.Add(_enemy);
		yield return new WaitForSeconds(spawnDelay);
	}
}

public void RemoveEnemy(GameObject _enemy)
{
	enemies.Remove(_enemy);
	Destroy(_enemy);
}
	`
},

{
	name: "Scroll.cs",
	language: "C#",
	description: "This handles the background scrolling. The background is split into 3 parts in Unity, so it doesn't feel snappy when it resets to the top.",
	code: `
void Update()
{
	this.transform.position += Vector3.down * moveSpeed * Time.deltaTime;

	if (this.transform.position.y + offset < secondCam.ScreenToWorldPoint(Vector2.right * (float)Screen.width).y)
	{
		this.transform.position = Vector2.up * 20;
	}
}
	`
},

{
	name: "PlayerMovement.cs",
	language: "C#",
	description: "This handles the movement of the Player character.",
	code: `
private void Awake()
{
	gameManager = GameObject.Find("Game Manager").GetComponent<GameManager>();

	controls = new Controls();

	controls.Player.Movement.performed += context => Movement(context.ReadValue<Vector2>());
	controls.Player.Movement.canceled += context => Movement(context.ReadValue<Vector2>());

	rb = GetComponent<Rigidbody2D>();
	spriteRenderer = GetComponentInChildren<SpriteRenderer>();
}

private void OnEnable()
{
	controls.Enable();
}

private void OnDisable()
{
	controls.Disable();
}

private void FixedUpdate()
{
	if (canMove) 
	{
		rb.linearVelocity = moveDirection * moveSpeed;
	}else
	{
		rb.linearVelocity = Vector2.zero;
	}

	//transform.eulerAngles = Vector3.Lerp(transform.eulerAngles, new Vector3(0, 0, moveDirection.x * -rotationMultiplier), rotationSpeed);
}

private void Movement(Vector2 _direction)
{
	moveDirection = new Vector2(_direction.x, 0f);
}

public IEnumerator Freeze(float _freezeTime)
{ 
	canMove = false;
	spriteRenderer.color = Color.blue;
	yield return new WaitForSeconds(_freezeTime);
	spriteRenderer.color = Color.white;
	canMove = true;
}

//Input
public void OnDeviceChange(PlayerInput _input)
{
	isGamepad = _input.currentControlScheme.Equals("Gamepad") ? true : false;
}
}
	`
},

{
	name: "PlayerHealth.cs",
	language: "C#",
	description: "This handles the Player Health. The icons are in an array and they get shown or hidden depending on how much health the player has. It also contains the flashing and invincibility functions that are timer based.",
	code: `
private void Update()
{
	foreach (GameObject healthIcon in healthIcons)
	{
		healthIcon.SetActive(false);

		for (int i = 0; i < hp; i++)
		{
			healthIcons[i].SetActive(true);
		}
	}

	if (hp <= 0)
	{
		Die();
	}

	//Player flashing
	if (invincible)
	{
		spriteRendererTimer -= 1f * Time.deltaTime * 10;

		if (spriteRendererTimer <= 0)
		{
			enableSpriteRenderer = !enableSpriteRenderer;
			spriteRendererTimer = 1f;
		}

		if (enableSpriteRenderer == true)
		{
			spriteRenderer.enabled = true;
		}
		else
		{
			spriteRenderer.enabled = false;
		}
	}
	else
	{
		spriteRenderer.enabled = true;
	}
}

private void OnTriggerEnter2D(Collider2D collision)
{
	if (!invincible)
	{
		if (collision.gameObject.tag == "Enemy Bullet")
		{
			hp--;
			StartCoroutine(Invincible(1f));
		}

		if (collision.gameObject.tag == "Freeze Bullet")
		{
			hp--;
			StartCoroutine(movement.Freeze(1));
			StartCoroutine(Invincible(1f));
		}

		if (collision.gameObject.tag == "Health Pickup")
		{
			if (hp < 3)
			{
				hp++;
			}

			Destroy(collision.gameObject);
		}
	}
}

public IEnumerator Invincible(float _iSeconds)
{
	invincible = true;
	yield return new WaitForSeconds(1f);
	invincible = false;
}

private void Die()
{
	SceneManager.LoadScene("Death Screen");
}
}
	`
},


],
},

// Not Grow A Garden //
{
  title: "Not Grow A Garden",
  slug: "not-grow-a-garden",
  banner: "/images/not grow a garden temp logo.png",
  icon: "/images/not grow a garden temp logo.png",

  date: "not released",
  displayDate: formatDisplayDate("not released"),

  href: "https://github.com/Linkerpink/Fnaf-Unity-Fortnite-Official-Game-Godot",
  github:
    "https://github.com/Linkerpink/Fnaf-Unity-Fortnite-Official-Game-Godot",

  imgSrc: "/images/not grow a garden temp logo.png",
  platform: "Itch.io",

  description: "anti horror \n\n Developers: \nLinkerpink\nMathijn Wismeijer",

  technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

  media: [{ type: "image", src: "/images/not grow a garden temp logo.png" }],

  featured: false,

  codeSnippets: [
    {
      name: "PlayerMovement.cs",
      language: "C#",
      description:
        "the player movement for the mobile game: not grow a garden (we haven't thought of a good name yet)",
      code: `using UnityEngine;
using UnityEngine.InputSystem;
using UnityEngine.Serialization;
using UnityEngine.UI;

public class PlayerMovement : MonoBehaviour
{
  #region Variabelen

  public Transform cameraTransformatie;
  
  [Header("Snelheden")]
  [SerializeField] private float bewegingsSnelheid;
  
  [Header("Hoeken")]
  private float m_hoek;
  private float m_doelHoek;
  private float m_laatsteHoek;
  
  [Header("Directies")]
  private Vector2 m_invoerDirectie;
  private Vector3 m_bewegingsDirectie;
  
  [Header("Soepel Bewegen")]
  [SerializeField] private float m_soepeleTijdDraaien = 0.1f;
  private float m_draaiSoepeleSnelheid;
  
  [Header("Componenten")]
  private Rigidbody m_stijfLichaam;
  private BlijheidStok m_blijheidStok;

  public bool magBewegen = true;
  
  private float deltaTijd = 0.0f; // Nodig voor anti insect kader snelheid text

  #endregion

  private void WakkerWorden()
  {
      m_stijfLichaam = GetComponent<Rigidbody>();
      m_blijheidStok = FindAnyObjectByType<BlijheidStok>();
  }
  
  private void Bijwerken()
  {
      // Krijg invoerdirectie van de blijheidStok
      m_invoerDirectie = m_blijheidStok.KrijgInvoer();
      
      deltaTijd += (Time.deltaTime - deltaTijd) * 0.1f;
  }

  private void VastBijwerken()
  {
      if (m_invoerDirectie.sqrMagnitude > 0.01f && magBewegen) 
      {
          m_bewegingsDirectie = new Vector3(m_invoerDirectie.x, 0, m_invoerDirectie.y);
          m_doelHoek = Mathf.Atan2(m_bewegingsDirectie.x, m_bewegingsDirectie.z) * Mathf.Rad2Deg + cameraTransformatie.eulerAngles.y;
          m_hoek = Mathf.SmoothDampAngle(transform.eulerAngles.y, m_doelHoek, ref m_draaiSoepeleSnelheid, m_soepeleTijdDraaien);
          m_laatsteHoek = m_hoek;
      }
      else
      {
          m_bewegingsDirectie = Vector3.zero;
          m_hoek = m_laatsteHoek;
      }

      if (magBewegen)
      {
          m_stijfLichaam.linearVelocity = m_bewegingsDirectie * bewegingsSnelheid;
      }
      
      transform.rotation = Quaternion.Euler(0f, m_hoek, 0f);
  }
  
  private void OnGUI()
  {
      if (SpelBeheerder.Instance.antiInsectInschakelen)
      {
          int w = Screen.width, h = Screen.height;
          GUIStyle style = new GUIStyle();

          Rect rect = new Rect(10, 100, w, h * 2 / 100);
          style.alignment = TextAnchor.UpperLeft;
          style.fontSize = h * 2 / 50;
          style.normal.textColor = Color.white;

          float fps = 1.0f / deltaTijd;
          string text = string.Format("{0:0.} fps", fps);
          GUI.Label(rect, text, style);    
      }
  }
  
  #region Neppe Functies
  
  private void Awake()
  {
      WakkerWorden();
  }
  
  private void Update()
  {
      Bijwerken();
  }

  private void FixedUpdate()
  {
      VastBijwerken();
  }

  #endregion
}`,
    },
  ],
},

  // Fnaf Unity Fortnite Official Game Godot //
  {
    title: "Fnaf Unity Fortnite Official Game Godot",
    slug: "fnaf-unity-fortnite-official-game-godot",
    banner: "/images/fnaf unity fortnite official game godot.webp",
    icon: "/images/fnaf unity fortnite official game godot.webp",

    date: "not released",
    displayDate: formatDisplayDate("not released"),

    href: "https://github.com/Linkerpink/Fnaf-Unity-Fortnite-Official-Game-Godot",
    github:
      "https://github.com/Linkerpink/Fnaf-Unity-Fortnite-Official-Game-Godot",

    imgSrc: "/images/fnaf unity fortnite official game godot.webp",
    platform: "Itch.io",

    description:
      "horror \n\n Developers: \nLinkerpink\nJesse Faassen \nhttps://sites.google.com/view/jesse-faassen/home?authuser=0 \n\nArtists: \nLinkerpink \nJesse Faassen \nhttps://sites.google.com/view/jesse-faassen/home?authuser=0",

    technologies: [
      "/images/fnaf unity fortnite official game godot.webp",
      "/images/unity logo.png",
      "/images/fortnite.webp",
      "/images/official.webp",
      "/images/game.jpg",
      "/images/godot logo.svg",
    ],

    media: [
      {
        type: "image",
        src: "/images/fnaf unity fortnite official game godot.webp",
      },
    ],

    featured: false,

    codeSnippets: [
      {
        name: "horror script",
        language: "C#",
        description: "ik ben LETTERLIJK beter.",
        code: `horror code`,
      },
    ],
  },



  // Asteroids 3D //
  {
    title: "Asteroids 3D",
    slug: "asteroids-3d",
    banner: "/images/asteroids 3d.webp",
    icon: "/images/asteroids 3d.webp",

    date: "2024-03-01",
    displayDate: formatDisplayDate("2024-03-01"),

    href: "https://linkerpink.itch.io/asteroids-3d",
    github: "https://github.com/Linkerpink/Poker-Roguelike",

    imgSrc: "/images/asteroids 3d.webp",
    platform: "itch.io",

    description:
      "Bug Exterminator is an indie SHMUP where you shoot mutant insects and help clean up a destroyed world. As a robot frog you fly through the land and defeat all the insects that stand in your way, but there's a menacing monster at the end, can you defeat it? \n\nThis game was created by a team of first year students (4 Game Artists, 2 Creative Software Developers) in under 3 weeks.",

    technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

    media: [{ type: "image", src: "/images/asteroids 3d.webp" }],

    featured: false,

    codeSnippets: [
      {
        name: "horror script",
        language: "C#",
        description: "ik was slechter.",
        code: `horror code`,
      },
    ],
  },

  // Not Not Balatro (even more traumatic flashbacks) //
  {
    title: "Not Not Balatro",
    slug: "not-not-balatro",
    banner: "/images/not not balatro banner.webp",
    icon: "/images/not not balatro icon.webp",

    date: "2025-01-27",
    displayDate: formatDisplayDate("2025-01-27"),

    href: "https://linkerpink.itch.io/not-not-balatro",
    github: "https://github.com/Linkerpink/Poker-Roguelike",

    imgSrc: "/images/not not balatro.webp",
    platform: "itch.io",

    description:
      "Not Not Balatro is a very good game 😱 \n\nwow i LOVE NOT NOT baltro but Not baltro is also very good game just like NOT NOT NOT baltro GL making NOT NOT baltro FR NOT NOT no cap/",

    technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

    media: [{ type: "image", src: "/images/not not balatro.webp" }],

    featured: false,

    codeSnippets: [
      {
        name: "horror script",
        language: "C#",
        description: "ik was slechter.",
        code: `horror code`,
      },
    ],
  },

  // Bug Exterminator (half a spider in 3 weeks!!! jeremy mode and maxwell mode make me not wanna cry) //
  {
    title: "Bug Exterminator",
    slug: "bug-xterminator",
    banner: "/images/shmup.webp",
    icon: "/images/shmup.webp",

    date: "2024-4-4",
    displayDate: formatDisplayDate("2024-4-4"),

    href: "https://rileytimmerman.itch.io/bug-exterminator",
    github: "https://github.com/Linkerpink/Poker-Roguelike",

    imgSrc: "/images/shmup.webp",
    platform: "itch.io",

    description:
      "Bug Exterminator is an indie SHMUP where you shoot mutant insects and help clean up a destroyed world. As a robot frog you fly through the land and defeat all the insects that stand in your way, but there's a menacing monster at the end, can you defeat it? \n\nThis game was created by a team of first year students (4 Game Artists, 2 Creative Software Developers) in under 3 weeks.",

    technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

    media: [
      { type: "image", src: "/images/shmup.webp" },
      { type: "youtubeId", src: "VBLMkvfqAlw", title: "Launch Trailer" },
    ],

    featured: false,

    codeSnippets: [
      {
        name: "horror script",
        language: "C#",
        description: "ik was slechter.",
        code: `horror code`,
      },
    ],
  },

  // Disco Dungeon (HELL) //
  {
    title: "Disco Dungeon",
    slug: "disco-dungeon",
    banner: "/images/disco dungeon temp.webp",
    icon: "/images/disco dungeon temp.webp",

    date: "2024-04-26",
    displayDate: formatDisplayDate("2024-04-26"),

    href: "https://linkerpink.itch.io/disco-dungeon",
    github: "https://github.com/Linkerpink/Poker-Roguelike",

    imgSrc: "/images/disco dungeon temp.webp",
    platform: "itch.io",

    description: "fortnite.",

    technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

    media: [{ type: "image", src: "/images/disco dungeon temp.webp" }],

    featured: false,

    codeSnippets: [
      {
        name: "horror script",
        language: "C#",
        description: "ik was slechter.",
        code: `horror code`,
      },
    ],
  },
].map((project) => ({
  ...project,
  slug: generateSlug(project.title),
}));

// Optional: sortProjects helper
export function sortProjects(projects: typeof allProjects, newestFirst = true) {
  return [...projects].sort((a, b) => {
    const aNotReleased = a.date.toLowerCase() === "not released";
    const bNotReleased = b.date.toLowerCase() === "not released";

    if (aNotReleased && bNotReleased) return 0;
    if (aNotReleased) return 1;
    if (bNotReleased) return -1;

    if (newestFirst) {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
  });
}
