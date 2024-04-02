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
library(effects)
library(ggplot2)
library(broom)

# Load data
setwd("/Users/prachimahableshwarkar/Documents/GW/OSS/gabor-exp/")
df <- read.csv('gabor-discrim-data.csv')
df$subjID <- factor(df$subjID) 
df$objSceneSemCong <- as.factor(df$objSceneSemCong)


# Fit logistic regression model
model <- glm(accuracy ~ scale + objSceneSemCong + scale*objSceneSemCong, data = df, family = "binomial")
# Summary of the model
summary(model)

model2 <- glmer(accuracy ~ scale*objSceneSemCong + (1|subjID), family = binomial, data = df)
summary(model2)

# mixed effects logistic regression
# model2 <- glmer(accuracy ~ scale + objSceneSemCong + scale*objSceneSemCong + (1|subjID), data = df, family = binomial)
# summary(model2)

