# MashupRx

Event driven app.

## The idea

The app must accept events from the keyboard or MidiAPI to trigger an audio sample and/or a video sprite on a channel, an effect like playback control, bitcrush, echo.
When audio is played, only one sample can be played at the time on a single channel, same for video sprite. The output always display the video of the upper layer.

## Procedure

1. Load the config file
> Should check if the config is correct

2. From the modules used in the config, let's create and link them.
> ES6 module are unfortunately impossible for now

3. Load assets (images + sounds)


## To do plan

- Add video filters on the fly
- Use variables for filters
- Set up channels
- Set up audio filters
