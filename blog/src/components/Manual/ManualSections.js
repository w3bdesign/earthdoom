export const MANUAL_SECTIONS = [
  {
    title: "Gameplay Overview",
    content: `
        <p>The game is actually quite simple. It's all about building troops and taking over land. The game is tick based, that is, every sixty seconds or so, when a "tick" happens, resources are distributed. The amount of resource you receive depends on the land you control (more on that later on). Also, you can produce units and buildings and research sciences for a certain amount of resources. These things take a certain amount of ticks (displayed in the ETA column of the units/science/building screens) to produce. Once you have ordered the research of a science or the production of a unit or building its ETA will decrease with each tick. When it reaches 0, the production is complete and you will be able to produce more of the same unit type (if you've just built a building or researched a science, you won't be able to do it again, but you don't need to do so anyway).</p>
        <p>The amount of seconds passed since the last tick are shown on the top right. If it becomes any larger than 300 seconds it is likely that the ticks are currently deactivated for some reason and you will not be able to do anything for the next couple of hours (sometimes it's just server lag, but 300 is a safe bet).</p>
      `,
  },
  {
    title: "Getting Started",
    content: `
        <p>In the beginning you can't do much. First thing to do is to get credits, which is the currency used by your citizens and in building troops.</p>
        <p>In order to get any credits, you need to construct the building "Tax collectors", which is free and takes 10 ticks to build. Just click on the symbol with the crossed wrenches in the column labelled "Build:". Then go and get yourself a drink or something and come back in about ten minutes. Just select "Building" from the navigation again and you should see the current ETA and status.</p>
        <p>If the construction is complete already, you are receiving a small amount of credits with each tick now. To increase it you need to research the science "Improved tax revenue" which costs 1000 credits and takes 25 ticks to complete. If you don't have 1000 credits, just wait a little.</p>
      `,
  },
  {
    title: "Titanium Extraction",
    content: `
        <p>The next thing to build is the "Titanium extractor" with an ETA of 20 ticks and a cost of 500 credits. It allows you to receive an amount of titanium every tick and produce titanium mines later on. Titanium is the most important resource because most heavy units need it and they need lots of it. Once you have constructed it, you should research the "advanced titanium extractor" for which you need to accumulate 1000 titanium and which takes 25 ticks to research.</p>
      `,
  },
  {
    title: "Scouts and Spying",
    content: `
        <p>You may want to increase the amount of resources you get now, just go to the section "Spying" (fourth option from the bottom in the navigation):</p>
        <p>You are able to send out scouts, each scout costs you 500 credits and the more scouts you send out, the more land they might find. Note however that they will have a harder time finding more land the more land you have already, so eventually scouting might turn out to become inefficient, but we shouldn't worry about that yet. It is recommended to send out as many scouts as possible in the beginning. If you only send out a few, they might find 0 land, which is quite a waste of credits.</p>
        <p>The land by itself increases your desirability as a target for stronger players, but doesn't do much else right now because it's undeveloped. In order to let it increase the amount of titanium and credits it produce (or make it produce any in the first place), you need to develop it first, which costs titanium. Go to the "income" screen to take a look at your stats now.</p>
      `,
  },
  {
    title: "Land Development",
    content: `
        <p>The top three bars show the amount of land you have developed and how you developed it. Houses produce credits, Titanium produces (guess what) titanium. The lower two bars show the amount of resources your nation produces as a whole. The percentages are not very important, but you should try to keep the income at 66% to 75% titanium and 25% to 33% credits if you plan to produce a lot of heavy units. In order to turn your undeveloped land (which should be about 100% now, if you have scouted for land yet -- if not, do so now) into developed land you need to fill out the form below the bars.</p>
        <p>You can chose what kind of land you want to develop and the amount of land you want to develop. The cost above that form will increase the more land you have developed already, so don't be too confused if you try to develop 50 land and it only lets you develop 3 -- maybe you just ran out of titanium, so just wait until you have enough of it to continue. As you develop more land the income bars will increase (or rather, the numbers next to it will) showing the amount of resources you get per tick. It'll always cost more to develop the next land than what you get within a tick, but it's a good idea to develop land for titanium first and then focus on the credits, otherwise you end up having to wait for ages until you are able to develop any land again.</p>
      `,
  },
  {
    title: "Science and Units",
    content: `
        <p>As you research new sciences and build new buildings more sciences and buildings will become available. Construct/research them as you get access to them, you'll need most of them later on.</p>
        <p>Once you have built the barracks, you can produce your first units. Go to the units screen now. Light infantry is a good standard unit, shadows tend to be a great supplement. You'll notice their cost and ETA is very different, but that doesn't mean one is better than the other. Right now the units you can produce are best used in combination, so it's recommended to produce some of both. The maximum amount of units of the type that you can construct right now (based on your available resources) is entered in the input field already, so just click "build" to produce them. You'll need a lot of units in battles, so there isn't really a "too much".</p>
        <p>In order to get any land from your enemy in a war (in EarthDoom most wars are about gaining land), you need to have the Robot Factory built, tho. Once it has been constructed, you can build new units, one of which is the grabber. Its description should be self-explanatory: it grabs the enemy's land and takes it home. Be sure to build masses of them. Goliaths might also come in handy, so build some of them as well, if you have any resources left.</p>
      `,
  },
  {
    title: "Energy and Combat",
    content: `
        <p>In order to fight, you first need energy. For that you first need to research fusion plants. Once that science is researched and ready, go to the "Energy" screen (last option in the upper part of the navigation). Depending on how war hungry you are, you should build many or only a few power plants. Note that they are rather expensive, so better save some titanium for them. Power plants continously produce energy. Energy is being stored and there's no real limit for it, so producing more plants will only increase the energy gained with each tick. If you only plan to attack around once a day, one or two will suffice. Enter the amount you wish to produce into the input box (the maximum possible is entered already) and press build. You can only produce Fusion plants right now, so ignore the drop down box.</p>
        <p>Once you have enough energy you might want to launch your first attack. You can only attack those in your "score" range -- the score is calculated depending on the size of your army and a couple of other things, so it basically reflects your military strength. As these large numbers tend to get irritating, try to focus on your rank. The rank is all that really matters anyway.</p>
      `,
  },
  {
    title: "Finding a Target and Attacking",
    content: `
        <p>To find a good victim in your range, open the "Ranking" screen from the navigation and scroll down until you find your position (you should have a green (ONLINE) appearing next to your name because you're logged in right now -- it's usually better to attack players who are not online, btw). Take a look at the guys around you and chose one you deem fitting, better noone with a clan tag in front of their name because they tend to be a nasty target for a clanless youngster like you. The third column shows the player's ID, it's a number of one to four digits, usually. Remember it or write it down, then switch to the "Military" screen.</p>
        <p>In order to send troops to attack someone, you need to move them from your base to the squad first. For that enter the amount of units of the selected unit type (just select All Units and type a large number and you will transfer all units you can use) and select "Squadron 1" in the "To squad" column and click "Submit Query" or press the Enter key.</p>
        <p>Scroll down a bit as the screen refreshes and you'll be told how much energy it will cost you to send the units which are in your squad to an enemy. Good thing you produced those plants, right? Enter the ID you were told to remember or write down into the input box (the one below "Launch Attack", not "Defend") and click "Attack". Only 30 more ticks and your squadron will reach your victim and attack him for five ticks.</p>
      `,
  },
  {
    title: "Combat Summary",
    content: `
        <p>During the battle, once the troops have arrived, you will be informed of your success or lack thereof in the "News" screen -- where your screen currently reads "Old news" (below the EarthDoom logo and version number), a blue button labelled "News" will appear, click it and you'll see how your war is going. It'll take a little time to understand the combat report, but then it should become quite clear what it's all about.</p>
        <p>If you took away any land from your victim, that land will be added to yours. Undeveloped land needs to be developed, but by now you know how that is to be done.</p>
        <p>The further you advance, the more units will be available and the more dangerous will the fights be. You might lose ten or twenty ranks in a bad battle, but in the end it can be a really fun way to kill some time.</p>
      `,
  },
];
