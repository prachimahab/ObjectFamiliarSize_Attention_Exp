# Object familiar size influences the efficiency of perceptual processing in natural scenes

OSF Pre-Registration: 
Visual Search Exp - https://osf.io/qfb3u
Gabor Discrimination Exp - https://osf.io/fuhpm

## Project Abstract
Visual attention within natural scenes is guided by semantic sources of information (e.g., object identity, and statistical regularities). The impact of semantic features on biasing attention in real-world scenes (Cornelissen & Võ, 2017; Hayes & Henderson, 2019) and for objects (Nah et al., 2021) has been demonstrated in many studies. Familiar object size specifically, has been shown to influence attentional selection in isolated objects (Collegio et al., 2019), however, its impact on visual attention within natural scenes remains undefined. Here, we investigate the influence of object familiar size on the efficiency of perceptual processing within natural scenes in two experiments: (1) visual search to a target object that is either mis-scaled or scaled appropriately, and (2) Gabor discrimination where the Gabor is placed atop a task-irrelevant object that is either mis-scaled or scaled appropriately. Additionally, objects are presented either in a semantically congruent (i.e., notebook in a classroom) or an incongruent scene (i.e., kettle in a classroom) to further test the impact of semantic expectations on performance. In the visual search task, we found faster response times if the object was scaled according to familiar size expectations. This effect persisted in the Gabor discrimination task, where the object was task-irrelevant. Both tasks also showed a perceptual boost for objects that were presented in semantically incongruent scenes. Altogether, these results demonstrate less efficient perceptual processing for objects that violate size expectations and imply an integration between semantic knowledge and spatial scale that modulates attention.  

## Experiments
In two experiments we presented images of natural scenes with objects realistically rendered on a surface in the scene using artificial intelligence object generation. The object was either displayed at its expected familiar size or inaccurately scaled. Additionally, the object varied in its semantic congruence with the scene. 

Visual Search: A visual search paradigm was employed where participants were first cued with the object name and then presented with a scene. Participants were tasked to respond whether the cued object was on the left or right side of the scene. The target object was presented either mis-scaled or scaled, and semantically congruent or incongruent with the scene. 

Gabor Discrimination: In this experiment we tested whether familiar object size influences attention even when the object is task-irrelevant. Participants were tasked with identifying the orientation of a Gabor, which was placed on an object in the scene. The object was not cued, meaning participants had to first find the object with the Gabor on it, and then respond whether the Gabor was oriented horizontally or vertically.

## What does this repository contain?

The folder for each experiment (visual search, gabor discrimination) contains the following:
1. Analysis  
2. Counterbalancing
3. Data
4. Frontend Experiment Code


### Analysis 
Scripts for data analysis. 

### Counterbalancing
Careful counterbalancing was employed to ensure that all scene-object pairs were presented across participants without scene repetition within participants. Target object side was randomly selected for each trial, with each side occurring an equal number of times.  Each participant completed 24 trials without any stimulus repetition, resulting in twenty-four unique trial sequences presented across participants. Object-scene semantic congruency was also counterbalanced with object scale (i.e. congruent & mis-scaled, congruent & scaled, incongruent & mis-scaled, and incongruent & scaled all occur equally). The scripts included here generate the counterbalanced sequences that are randomly assigned to participants. 


### Frontend Experiment Code
All participants were recruited via Amazon's Mechanical Turk or Prolific (online data collection platforms), presented with an IRB compliant comprehensive consent form, and paid for their efforts according to the time each task took. This folder contains all frontend code necessary to collect data. An Apache server was used to run the experiment, and needs to be configured to allow for CORS in order for the web content to load. A copy of the Amazon Machine Image (AMI) created to host this experiment can be used for easy replication (provided upon request). Participants completed the experiment online either (1) via a link to a Heroku server that selected a unique trial sequence (see Counterbalancing) that automatically directed participants to the experiment hosted on an Amazon Web Service (AWS) server or (2) directly via the Apache server using Amazon Mechanical Turk's built-in functionality for publishing a HIT with a batch of experiment links. 

- The main files for running the experiment are [exp-name]_CSS.css, [exp-name]_JS.js, and [exp-name]_HTML.html 
- The data is logged and saved as a CSV on the server in saveFile.php
- Participants receive an unique completion code via revealCode.html
- /visual-search/frontend_experiment_code/batch_variables/variables.csv: contains the variables that are needed for source_withFeedback.html (e.g. survey link). This method allows experimenters to publish a batch of multiple HITs (Human Intelligence Task) on Mechanical Turk
- /gabor-discrimination/frontend_experiment_code/batch_variables/gab-discrim-variables.csv: contains the variables (i.e., links) uploaded to the Heroku server (randomly distributed without repetition) 

Unique, counterbalanced trial sequences were made for both experiments. The following files allow for a balanced design in terms of images, and all experimental conditions. 
- The folder 'jsons' contains the unique trial structures. Each json file contains the image file names in their correct order. Other experimentsl conditions are assigned in the JS file. 
- Fixation files (e.g., fixation.jpg, standard fixation image)
- Colored masks (unique mask per trial)
- counterbalancing.csv is a file that is referenced in [exp-name]_JS.js to select the correct trial sequence (JSON file) for a given task/HIT 


## Contact:
If you are interested in learning more about our work or have any questions feel free to contact us! 

Prachi Mahableshwarkar: prachi.sm11@gmail.com, pmahable@gwu.edu
Ellie Robbins: erobbins105@gwmail.gwu.edu
Dwight Kravitz: kravitz@gwu.edu
Sarah Shomstein: shomstein@gwu.edu
John Philbeck: philbeck@gwu.edu

