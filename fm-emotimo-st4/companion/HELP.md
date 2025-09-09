![eMotimo Logo](logo.png)

# Important!
For labels to line up, Put the slide motor in M3, and the zoom motor in M4.
If you use a focus motor instead, M4 should work for that instead of zoom.
I Have not tested with it on focus, use at your own risk!


## Functions
**Smart means it applies to the selected attribute**
* Run time // How fast the preset runs
* * Run time
* * Run time set from value
* * Smart Run Time
* * Smart Run Time set from value
###
* Ramp time // How fast the preset speeds up from a stop
* * Ramp time
* * Ramp time set from value
* * Smart ramp Time
* * Smart ramp Time set from value

## Company Overview
eMotimo is an industry leader in motion control. We specialize in makes multi axis motion control heads for the cinema space. 

Our flagship product the [ST4](https://emotimo.com/products/st4?variant=18140355887201) is a proven motion control head that has been used in numerous productions since 2016. With it you can control Pan/Tilt/Slide and a Turntable or a Focus motor. For even more control the upgraded [ST4.3](https://emotimo.com/products/st4?variant=42138608140469) that released mid 2022 frees up the M2 port so that it can be used for the Turntable and includes an additional Expansion Port that integrates with the popular Tilta Nucleus motors giving control of a full FIZ solution.

![ST4](ST4.jpg)


The [SA2.6](https://emotimo.com/pages/sa2point6) is our latest motion control unit that we like to call the conductor. It gives you control of 2 Motor drivers for your Slide and Turntable, 3 Tilta motors for full FIZ control, and seemlessly integrates with DJI's RS3 Pro/RS3/RS2 Gimbals giving you control of Pan/Tilt/Roll and another option for Focus control. The SA2.6 is officially in production now and can be purchased from our [shop](https://emotimo.com/products/sa2-6-controller?_pos=2&_psq=SA&_ss=e&_v=1.0&variant=42925931462837)

![SA2.6](SA2.6.jpg)

## Setup and Release Notes 
![StreamdeckArchitecture](StreamDeckArchitecture_092023.jpg)
This module will allow you to control your [ST4](https://emotimo.com/products/st4?variant=18140355887201)/[ST4.3](https://emotimo.com/products/st4?variant=42138608140469) as well as the brand new [SA2.6](https://emotimo.com/pages/sa2point6)

For steps on how to connect your eMotimo device check out our [Setup Article](https://support.emotimo.com/hc/en-us/articles/16468918293773-1-Getting-Started-ST4-ST4-3)

To get started we recommend downloading the default configuration we've made for our user. Find the default configuration and an explanation of how it works here: [eMotimo Configuration](https://support.emotimo.com/hc/en-us/articles/16472089694221-2-Stream-Deck-Configuration)

Check out our knowledge base for guides on customizing your own configurations and the latest release notes.
[support.emotimo.com](https://support.emotimo.com/hc/en-us/categories/360003772632-StreamDeck-and-BitFocus-Companion-with-the-eMotimo-ST4-and-ST4-3)

## Feature Requests and Bug Tracking
Send us an email: info@emotimo.com

Want to see how far you can push this module:

Check out the [eMotimo API](https://support.emotimo.com/hc/en-us/articles/360007015111-The-eMotimo-ST4-API) and this modules [Repository](https://github.com/bitfocus/companion-module-emotimo-st4) and the [Modified](https://github.com/GermyCode/companion-module-fm-emotimo) on github


# Updates
### V1.1.3
* When setting up loops it used to send a command everytime a loop action happened, like setting the A or B points. Now it only sends one command on loop recall with the info sotred in this modules variables. 
  * Reason: 
    1. it just sends somany commands when setting up loops, 
    2. You cant recall loop info from the emotimo like you can with presets, so theres no reason to always keep it updated when making loops, instead only update it once on recall

### V1.1.1
* Modern connection system with merged smart actions from V1.1.1

### V1.1.1
* Legacy connection system
- Merged smart and normal actions into one action. There is now a dropdown to select smart or preset in the action. 
  * Reason: There were lots of actions and it could be confusing on which to use, also added tooltips that might help

### V1.1.0
* If it disconnects dont keep piling up requests, so when it disconnects it doesnt flood the emotimo and stall it
* removed G900 heartbeat keep-alive command as its not necessary

### V1.0.4
* added G900 heartbeat keep-alive command
* added the set run/ramp time by value action for loops

### V1.0.3

### V1.0.2

### V1.0.1

### V1.0.0
