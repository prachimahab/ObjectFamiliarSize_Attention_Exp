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
library(emmeans)
library(ggplot2)


# Load data
setwd("/Users/prachimahableshwarkar/Documents/GW/OSS/gabor-exp/")
df <- read.csv('gabor-discrim-CO_RT.csv')

df$subjID <- factor(df$subjID) 
df$objSceneSemCong <- factor(df$objSceneSemCong) 


mod_main <- lmer(zsRT ~ scale + objSceneSemCong + scale*objSceneSemCong + (1|subjID), data=df, REML=FALSE)

summary(mod_main)
anova(mod_main)



# Compute the estimated marginal means for scale and objSceneSemCong
emm_scale = emmeans(mod_main, ~ scale)
emm_objSceneSemCong = emmeans(mod_main, ~ objSceneSemCong)

# Plot for scale
ggplot(summary(emm_scale), aes(x=scale, y=emmean)) +
  geom_point() +
  geom_line() +
  labs(title="Effect of Scale on zsRT", x="Scale", y="Estimated Marginal Mean of zsRT")

# Plot for objSceneSemCong
ggplot(summary(emm_objSceneSemCong), aes(x=objSceneSemCong, y=emmean)) +
  geom_point() +
  geom_line() +
  labs(title="Effect of objSceneSemCong on zsRT", x="objSceneSemCong", y="Estimated Marginal Mean of zsRT")

# Interaction plot
emm_interaction = emmeans(mod_main, ~ scale*objSceneSemCong)
ggplot(summary(emm_interaction), aes(x=scale, y=emmean, color=objSceneSemCong)) +
  geom_point() +
  geom_line() +
  labs(title="Interaction between Scale and objSceneSemCong on zsRT", x="Scale", y="Estimated Marginal Mean of zsRT")

# Convert the summary of emm_interaction to a data frame for plotting
emm_interaction_df = summary(emm_interaction) %>%
  as.data.frame()

# Assuming emm_interaction_df already exists and includes 'emmean' and 'SE' (standard error)
# Calculate the upper and lower bounds of the error bars using the standard error
emm_interaction_df$upper <- emm_interaction_df$emmean + emm_interaction_df$SE
emm_interaction_df$lower <- emm_interaction_df$emmean - emm_interaction_df$SE

# Modified bar graph with specified fill colors based on objSceneSemCong and increased font size
bar_interaction_plot_custom_colors = ggplot(emm_interaction_df, aes(x=scale, y=emmean, fill=factor(objSceneSemCong))) +
  geom_bar(stat="identity", position=position_dodge(width=0.8), width=0.7) +
  geom_errorbar(aes(ymin=lower, ymax=upper), position=position_dodge(width=0.8), width=0.25) +
  labs(title="", x="Scale", y="Estimated Marginal Mean of zsRT", fill="objSceneSemCong") + # Custom legend title for fill
  scale_fill_manual(values=c("0"="blue", "1"="lightblue")) + # Custom colors for objSceneSemCong
  theme_minimal() +
  theme(text = element_text(size = 16), # Increase base text size
        plot.title = element_text(size = 20), # Increase plot title size
        axis.title = element_text(size = 18, color="black"), # Increase axis titles size and ensure they are black
        axis.text.x = element_text(color="black"), # Ensure x axis labels are black
        axis.text.y = element_text(color="black"), # Ensure y axis labels are black
        legend.title = element_text(size = 16), # Increase legend title size
        legend.text = element_text(size = 14), # Increase legend text size
        panel.grid.major = element_blank(), # Remove major grid lines
        panel.grid.minor = element_blank(), # Remove minor grid lines
        axis.line = element_line(color="black")) # Make axis lines black

# Print the plot with custom colors, increased font size, no grid, black axis lines, and black axis labels
print(bar_interaction_plot_custom_colors)




