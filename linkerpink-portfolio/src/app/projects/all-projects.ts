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
      "Robo Rebellion Dawn of the Machine, is a top down TwinStick game made by a team of 6 people. 3 Artists and 3 Developers, the game was made as a school project within a short timespan of 4 weeks with it's end goal being a sci-fi based top down shooter.\n\nFEATURES\n\nThe game build supports both QWERTY keyboards and controller. Realistic gun bass! Trigger warning. (Headphone users be warned.)",

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
        language: "csharp",
        description:
          "Here are some functions I made for the player. the player was made with multiple people, so I will only be showing the parts I made, and are also interesting. I was in control of the player movement, controller support, animation switching, state switching, player rotation / look at and dashing",
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
        language: "csharp",
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
        language: "csharp",
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
        language: "csharp",
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
        language: "csharp",
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
        language: "csharp",
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
    banner: "/images/not suepr maria 63.png",
    icon: "/images/not suepr maria 63.png",
    date: "2025-04-17",
    displayDate: formatDisplayDate("2025-04-17"),
    platform: "Itch.io",
    description:
      "VERY GOOD REMAKE OF SUEPR MARIA 63 😎😎😨😱 (please don't sue this is a school project)",
    href: "https://linkerpink.itch.io/not-suepr-maria-63",
    github: "https://github.com/Linkerpink/NOT-Suepr-Maria-63",

    technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

    media: [
      { type: "image", src: "/images/not suepr maria 63.png" },
      { type: "image", src: "/images/not suepr 1.png" },
      { type: "image", src: "/images/not suepr 2.png" },
      { type: "image", src: "/images/not suepr 3.png" },
      { type: "image", src: "/images/not suepr 4.png" },
      { type: "youtubeId", src: "9c8ntgfiQsk", title: "Gameplay Video" },
    ],

    featured: true,

    codeSnippets: [
      {
        name: "insane script",
        language: "csharp",
        description: "ik was beter.",
        code: `insane code`,
      },
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
      "The Royal Spin is a game made by a group of 4 students. \n\nGamble and drink your heart out to pay rent and turn the tide with powerful spell cards. In this game you play Slots, Roulette and Russian Roulette. The goal is buying keys to escape. \n\nDevelopers: \nhttps://sites.google.com/view/mark-biesheuvel-portfolio \nhttps://linkerpink-github-io-beta.vercel.app/ \n\nArtists: \nhttps://www.artstation.com/bellebunnik \nhttps://www.artstation.com/sekerio",
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
        name: "insane script",
        language: "csharp",
        description: "ik was beter.",
        code: `insane code`,
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
      "When Time Collides is a small retro platformer where you have to parkour your way through multiple levels while being able to controll time. But what does switching the time do? Are there any enemies? Find out while playing yourself.",

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
        name: "insane script",
        language: "gml",
        description: "ik was beter.",
        code: `insane code`,
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

    description: "best portfolio website ever made?Q?!?!?!!?",

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

    description: "banger emotes",

    technologies: ["/images/unity logo.png", "/images/c sharp logo.svg"],

    media: [{ type: "image", src: "/images/SHYGame.jpg" }],

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
      "Slimetastic Punchout is a chaotic and fun local multiplayer game where you take control of colorful, squishy slimes and battle it out in fast-paced arenas. The goal? Cover as many tiles as you can while sliding, bouncing, and splattering your way across the map. Along the way, you can land some solid punches to shove your opponents out of the way—or just throw them off their game. Every match is unpredictable, full of laughter, and a messy fight for control. It’s slimy chaos at its best! \n\nDevelopers: \nNiels de Laat \nNoah van Uunen \n\nArtists: \nSeemay Alsemgeest \nJordy Andriessen \nLisa van der Kloet",

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
        name: "horror script",
        language: "csharp",
        description: "ik was slechter.",
        code: `horror code`,
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
        language: "csharp",
        description: "ik ben LETTERLIJK beter.",
        code: `horror code`,
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
        language: "csharp",
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
      "pain multiplied by 2 \n\nScratch version: \nhttps://scratch.mit.edu/projects/1076756881/",

    technologies: [
      "/images/unity logo.png",
      "/images/c sharp logo.svg",
      "/images/scratch logo.png",
    ],

    media: [{ type: "image", src: "/images/shmup 2.webp" }],

    featured: false,

    codeSnippets: [
      {
        name: "horror script",
        language: "csharp",
        description: "ik was slechter.",
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
        language: "csharp",
        description: "ik was slechter.",
        code: `horror code`,
      },
    ],
  },

  // Not Not Balatro (even more traumatic flashbacks) //
  {
    title: "Not Not Balatro",
    slug: "not-not-balatro",
    banner: "/images/not not balatro.webp",
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
        language: "csharp",
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
        language: "csharp",
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

    media: [
      { type: "image", src: "/images/disco dungeon temp.webp" },
    ],

    featured: false,

    codeSnippets: [
      {
        name: "horror script",
        language: "csharp",
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
