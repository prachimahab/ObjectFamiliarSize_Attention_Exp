# load LME package
library('lme4')
library(nlme)
library('lmerTest')
library('partR2') # https://cran.r-project.org/web/packages/partR2/vignettes/Using_partR2.html
library(AICcmodavg)
library(MuMIn)
library(multilevel) 
library('r2glmm')

library(tidyverse) #for all data wrangling
library(cowplot) #for manuscript ready figures
library(sjPlot) #for plotting lmer and glmer mods
library(sjmisc) 
library(effects)
library(sjstats) #use for r2 functions

# Load data
setwd("/Users/prachimahableshwarkar/Documents/GW/OSS/")
df <- read.csv('visual-search-CO-data.csv')
df$subjID <- factor(df$subjID) 
df$objSceneSemCong <- factor(df$objSceneSemCong) 


mod_main <- lmer(zsRT ~ scale + presentationSize + objSceneSemCong + scale*presentationSize*objSceneSemCong + (1|subjID), data=df, REML=FALSE)
summary(mod_main)
anova(mod_main)

mod_main2 <- lmer(zsRT ~ scale*objSceneSemCong + (1|subjID) + (1|presentationSize), data=df, REML=FALSE)
summary(mod_main2)
anova(mod_main2)

mod_main4 <- lmer(zsRT ~ scale*objSceneSemCong*cannonical_size + (1|subjID)+ (1|presentationSize), data=df, REML=FALSE)
summary(mod_main4)
anova(mod_main4)

library(ggplot2)
library(dplyr)

# Compute the estimated marginal means for scale and objSceneSemCong
emm_scale = emmeans(mod_main, ~ scale)
emm_objSceneSemCong = emmeans(mod_main, ~ objSceneSemCong)
emm_presentationSize = emmeans(mod_main, ~ presentationSize)

emm_interaction = emmeans(mod_main, ~ scale*objSceneSemCong*presentationSize)


# Assuming emm_interaction_df is already created and includes presentationSize, scale, objSceneSemCong, emmean, SE, and calculated upper and lower
# Convert the summary of emm_interaction to a data frame for plotting
emm_interaction_df = summary(emm_interaction) %>%
  as.data.frame()

# Adjust the factor levels to control the order
# emm_interaction_df$presentationSize <- factor(emm_interaction_df$presentationSize, levels = c("large", "small"))
# emm_interaction_df$scale <- factor(emm_interaction_df$scale, levels = c("misscaled", "scaled"))
# emm_interaction_df$objSceneSemCong <- factor(emm_interaction_df$objSceneSemCong, levels = c("1", "0"))

# Order the dataframe based on your specifications
emm_interaction_df <- emm_interaction_df %>%
  arrange(presentationSize, scale, objSceneSemCong)

emm_interaction_df$upper <- emm_interaction_df$emmean + emm_interaction_df$SE
emm_interaction_df$lower <- emm_interaction_df$emmean - emm_interaction_df$SE

