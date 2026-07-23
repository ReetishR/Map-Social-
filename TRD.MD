# WhereTo Product Requirements Document

## 1. Product Overview

### Product Name

WhereTo

### Tagline

Less debating. More doing.

Alternative taglines:

* Find the fairest place to meet.
* From "where should we go?" to a confirmed plan.
* Pick a place everyone can actually reach.
* Stop scrolling. Start going.
* Your group's fastest route from maybe to decided.

### Product Type

Mobile-first responsive web application.

### Initial Launch Market

Bangalore, India.

### Product Vision

WhereTo helps friends, couples, families, and colleagues overcome decision paralysis when planning an outing.

Users create a plan, invite participants, privately add their starting locations and preferences, and receive a small number of optimized recommendations.

The app considers:

* Travel time.
* Travel fairness.
* Budget.
* Venue category.
* Cuisine.
* Transport mode.
* Ratings.
* Opening hours.
* Dietary requirements.
* Accessibility.
* Parking.
* Metro proximity.
* Group preferences.
* Venue novelty.
* Group voting.

The entire experience should feel like a multiplayer decision game rather than a traditional form or venue directory.

Users should feel as though they are entering a shared game lobby, revealing the best meeting zones, comparing venue cards, voting, eliminating options, and confirming a winner.

WhereTo is not intended to show every possible place. It is designed to help a group make a decision.

---

## 2. Problem Statement

Planning an outing with multiple people is often frustrating and inefficient.

A typical group conversation includes:

* "Where should we go?"
* "Anything is fine."
* "That is too far."
* "That place is too expensive."
* "I have already been there."
* "Can we go somewhere closer?"
* "Let us decide later."

The result is often:

* Long message threads.
* Repeated suggestions.
* Unfair travel arrangements.
* Too many choices.
* Delayed decisions.
* Cancelled plans.
* One person doing all the planning work.

Existing products such as maps, restaurant directories, event platforms, and social media pages are primarily designed for discovery.

They help users search for places, but they do not solve the group decision problem.

WhereTo should turn a vague intention to meet into a confirmed venue, date, and time in less than five minutes.

---

## 3. Product Goals

### 3.1 Primary Goal

Help a group select and confirm a suitable venue and meeting time within five minutes.

### 3.2 Secondary Goals

* Reduce decision paralysis.
* Reduce the number of options users must evaluate.
* Recommend locations that are reasonably fair for everyone.
* Account for individual budgets and preferences.
* Reduce the organizer's planning burden.
* Make group decision-making enjoyable.
* Encourage users to explore new places.
* Create reusable group preference profiles.
* Produce a final plan that can be shared immediately.

### 3.3 Success Definition

A successful WhereTo session ends with:

1. Multiple participants joining a shared plan.
2. Participants submitting locations and preferences.
3. The app generating suitable recommendations.
4. The group voting or selecting an option.
5. A venue, date, and time being confirmed.
6. The final plan being shared or added to calendars.

---

## 4. Non-Goals for the MVP

The first version will not:

* Provide turn-by-turn navigation.
* Replace Google Maps.
* Operate as a restaurant booking platform.
* Process event ticket purchases.
* Process payments.
* Split bills.
* Support multi-day travel itineraries.
* Build a public social network.
* Host public venue reviews.
* Support every city at launch.
* Create complex multi-stop plans.
* Use advanced personalized machine learning before sufficient data exists.
* Guarantee real-time venue availability unless supported by an external provider.

---

## 5. Target Users

### 5.1 Friend Groups

Groups of three to eight friends planning:

* Dinner.
* Drinks.
* Café visits.
* Movies.
* Gaming.
* Activities.
* Weekend outings.
* Nightlife.

Their primary challenges are distance, cost, preferences, and indecision.

### 5.2 Couples

Two people deciding where to meet based on:

* Travel convenience.
* Ambience.
* Budget.
* Date style.
* Cuisine.
* Novelty.

### 5.3 Families

Families planning:

* Lunch.
* Dinner.
* Parks.
* Shopping.
* Movies.
* Child-friendly activities.

Their priorities may include parking, accessibility, predictability, safety, and family suitability.

### 5.4 Colleagues

Coworkers planning:

* Team lunch.
* After-work drinks.
* Team dinner.
* Off-site activities.
* Informal meetings.

Their priorities may include office proximity, group seating, budget, transit access, and timing.

### 5.5 Group Organizers

The person who usually initiates plans and becomes responsible for gathering everyone's preferences.

This user needs:

* A fast plan-creation flow.
* Easy invitation links.
* Clear participant progress.
* Defensible recommendations.
* Simple voting.
* A confirmed result.

---

## 6. Product Principles

### 6.1 Decision Over Discovery

WhereTo should not show users hundreds of venues.

The default output should be three strong recommendations.

### 6.2 Multiplayer by Default

The experience should feel collaborative and live.

Participants should see:

* Who has joined.
* Who has submitted preferences.
* When recommendations are unlocked.
* Who has voted.
* When a winner is selected.

### 6.3 Fairness Over Midpoint

The geographically central location is not always the most convenient location.

WhereTo should optimize actual estimated travel time and accessibility.

### 6.4 Explain Every Recommendation

Users should understand why a venue was selected.

Example:

Recommended because everyone can arrive within approximately 35 minutes, it fits the group's ₹1,000 budget, and it is close to Indiranagar Metro Station.

### 6.5 Fewer, Distinct Options

Recommendations should differ meaningfully.

The app should avoid presenting three nearly identical restaurants in the same area.

### 6.6 Privacy by Default

Participants should be able to use their exact location for calculations without exposing it to the group.

### 6.7 Fun Without Friction

Game mechanics should help the group decide faster.

They should not make the planning process longer or more complicated.

---

## 7. Core User Journey

### 7.1 Create a Plan

The organizer selects Create a Plan.

The organizer enters:

* Plan title.
* Activity type.
* Possible date.
* Possible time.
* Approximate group size.
* Optional initial constraints.

Example plan titles:

* Friday Night Drinks.
* Sunday Brunch.
* Team Dinner.
* Birthday Plan.
* Coffee Catch-Up.
* Saturday Adventure.

### 7.2 Create a Group Lobby

After creating a plan, the organizer enters a shared group lobby.

The lobby displays:

* Plan title.
* Participant count.
* Join link.
* Submission progress.
* Activity type.
* Response deadline.
* Start recommendation button.

The organizer can share the link through:

* WhatsApp.
* Telegram.
* Instagram.
* Email.
* Copy link.

### 7.3 Join the Plan

Participants join using the shared link.

An account should not be required for the MVP.

Each participant enters:

* Display name.
* Starting location.
* Transport mode.
* Maximum travel time.
* Budget.
* Availability.
* Preferred activities.
* Hard constraints.
* Optional preferences.

### 7.4 Reveal the Group Map

As participants join, the map displays approximate participant locations.

The app should visually reveal:

* Participant zones.
* Travel boundaries.
* Possible meeting regions.
* Areas where participant travel zones overlap.

This should feel like a game map being unlocked.

### 7.5 Generate Recommendations

Once sufficient participant information has been submitted, the organizer selects Find Our Spot.

The system:

1. Calculates feasible meeting zones.
2. Retrieves suitable venues.
3. Removes venues violating hard constraints.
4. Scores the remaining venues.
5. Selects three distinct recommendations.
6. Generates an explanation for each recommendation.

### 7.6 Compare Recommendations

The three primary recommendations should be labeled:

* Best Overall.
* Most Convenient.
* Wild Card.

Optional labels include:

* Best Value.
* Fairest Commute.
* Hidden Gem.
* Most Exciting.
* Metro Friendly.

### 7.7 Decide as a Group

The group can use:

* Simple voting.
* Ranked voting.
* Option battle.
* Swipe mode.
* One-veto mode.
* Random spin.
* Decision timer.

### 7.8 Confirm the Plan

The winning venue becomes the confirmed plan.

The group can then:

* View directions.
* Share the final plan.
* Add it to calendars.
* Call the venue.
* Open the booking provider.
* Change the time.
* Reopen voting.
* Select a backup venue.

---

## 8. Core Features

### 8.1 Interactive Bangalore Map

The primary product interface should be a two-dimensional interactive map.

The map should support:

* Pan.
* Zoom.
* Mobile touch gestures.
* Participant markers.
* Venue markers.
* Neighborhood labels.
* Metro stations.
* Suggested meeting zones.
* Route previews.
* Travel-time regions.
* Marker clustering.
* Dark map styling.
* Day and night venue indicators.

The map should initially focus on Bangalore.

Relevant planning areas include:

* Indiranagar.
* Koramangala.
* HSR Layout.
* Whitefield.
* Marathahalli.
* Bellandur.
* MG Road.
* Church Street.
* Jayanagar.
* JP Nagar.
* Malleshwaram.
* Hebbal.
* Yelahanka.
* Electronic City.
* Rajajinagar.
* Banashankari.
* Sarjapur Road.
* Brigade Road.

These locations should not be hard-coded as the only supported areas.

### 8.2 Location Input

Users should be able to provide their location through:

* Device location.
* Address search.
* Landmark search.
* Neighborhood selection.
* Map pin.
* Metro station.
* Saved location.

Example saved locations:

* Home.
* Office.
* College.
* Current location.

#### Privacy Levels

Users should select one of the following:

* Exact location used privately for calculations.
* Approximate area shown to participants.
* Neighborhood shown to participants.
* Nearby landmark shown to participants.

Exact coordinates should never be shown to other participants by default.

### 8.3 Activity Selection

Initial activity categories should include:

* Restaurant.
* Café.
* Pub.
* Bar.
* Brewery.
* Brunch.
* Street food.
* Dessert.
* Movie.
* Live music.
* Comedy.
* Gaming.
* Bowling.
* Escape room.
* Shopping.
* Park.
* Museum.
* Art and culture.
* Sports activity.
* Family activity.
* Date.
* Nightlife.
* Surprise me.

Activity-specific filters should appear after a category is selected.

#### Restaurant Filters

* Cuisine.
* Vegetarian options.
* Vegan options.
* Price.
* Ambience.
* Group seating.
* Alcohol availability.
* Indoor or outdoor.

#### Nightlife Filters

* Music type.
* Dance floor.
* Entry cost.
* Closing time.
* Dress expectations.
* Alcohol.
* Live performance.
* Noise level.

#### Family Filters

* Child-friendly.
* Parking.
* Accessibility.
* Safety.
* Seating.
* Noise level.
* Indoor or outdoor.

### 8.4 Participant Preference Card

Each participant completes a compact interactive preference card.

#### Required Inputs

* Starting location.
* Transport mode.
* Maximum travel time.
* Budget.
* Availability.

#### Optional Inputs

* Preferred categories.
* Cuisine.
* Dietary restrictions.
* Indoor or outdoor.
* Quiet or lively.
* Familiar or adventurous.
* Parking requirement.
* Metro preference.
* Accessibility needs.
* Alcohol preference.
* Places already visited.
* Areas to avoid.

#### Preference Strength

Participants can classify each preference as:

* Must Have.
* Strong Preference.
* Nice to Have.
* No Preference.

Hard constraints should remove unsuitable venues.

Soft preferences should influence ranking.

### 8.5 Transport Modes

The MVP should support:

* Car.
* Two-wheeler.
* Auto-rickshaw or taxi.
* Metro.
* Bus or public transport.
* Walking.

Users should be able to choose:

* Primary transport mode.
* Alternative acceptable modes.
* Maximum walking distance.
* Maximum number of transit transfers.

### 8.6 Smart Meeting-Zone Calculation

WhereTo should identify practical meeting zones using:

* Participant coordinates.
* Travel-time estimates.
* Transport mode.
* Current or expected traffic.
* Public transport access.
* Maximum travel limits.
* Venue density.
* Group budget.
* Venue operating hours.
* Safety and accessibility.
* Participant preferences.

The meeting zone should not be a simple geographic midpoint.

#### Example

Participants are located in Whitefield, Hebbal, and Koramangala.

The geographic midpoint may fall in an area with poor venue selection or transport access.

WhereTo should instead recommend a slightly different zone with:

* Better connectivity.
* More suitable venues.
* Lower maximum travel time.
* Better fairness across participants.

### 8.7 Venue Recommendation Engine

The system should retrieve venue candidates within feasible meeting zones.

Venue information may include:

* Name.
* Category.
* Address.
* Coordinates.
* Rating.
* Review count.
* Price level.
* Cuisine.
* Opening hours.
* Images.
* Parking.
* Metro proximity.
* Accessibility.
* Group suitability.
* Popularity.
* Reservation information.
* Event schedule.
* Estimated crowd level.
* Data freshness.

#### Recommendation Types

**Best Overall**

The strongest balance of travel convenience, preference fit, budget, quality, and fairness.

**Most Convenient**

The lowest overall travel burden.

**Fairest Commute**

The option with the smallest difference between the shortest and longest participant commute.

**Best Value**

The strongest option within the lower end of the group budget.

**Wild Card**

A more unusual or exciting option that still satisfies mandatory constraints.

**Hidden Gem**

A less obvious venue with strong quality signals.

---

## 9. Recommendation Scoring

Each venue should receive a group suitability score.

A proposed initial weighting is:

* 30% travel convenience.
* 20% preference compatibility.
* 15% budget compatibility.
* 10% fairness.
* 10% venue quality.
* 5% transport accessibility.
* 5% availability.
* 5% novelty.

These weights should be configurable.

### 9.1 Travel Convenience Score

Consider:

* Average travel time.
* Maximum travel time.
* Total group travel time.
* Number of transfers.
* Walking distance.
* Traffic reliability.
* Transport complexity.

### 9.2 Fairness Score

The score should penalize venues that create a significantly longer journey for one participant.

Possible fairness metric:

Maximum participant travel time minus median participant travel time.

Lower values indicate greater fairness.

### 9.3 Preference Compatibility Score

The system should:

* Exclude venues that violate hard constraints.
* Heavily reward strong preferences.
* Moderately reward soft preferences.
* Avoid overfitting to a single participant unless the group chooses to prioritize them.

### 9.4 Budget Compatibility Score

The system should evaluate:

* Whether the venue fits every participant's budget.
* Whether it fits the group median budget.
* Expected additional charges.
* Entry fee.
* Parking cost.
* Travel cost.
* Taxes or service charges where available.

### 9.5 Venue Quality Score

Potential signals:

* Average rating.
* Review volume.
* Review recency.
* Venue data completeness.
* Group suitability.
* User feedback.
* Popularity.
* Reliability of hours and pricing data.

### 9.6 Confidence Score

Each recommendation should have:

* High confidence.
* Medium confidence.
* Low confidence.

Confidence should reflect:

* Data completeness.
* Data freshness.
* Routing reliability.
* Price certainty.
* Opening-hour certainty.

---

## 10. Recommendation Explanation

Every recommendation must explain why it was selected.

Example:

Best Overall because all four participants can arrive within approximately 38 minutes, it matches the group's ₹1,200 budget, offers vegetarian food, and is six minutes from a metro station.

Each recommendation should display:

* Average travel time.
* Longest travel time.
* Estimated cost.
* Preference match percentage.
* Fairness score.
* Primary benefits.
* Main trade-off.
* Confidence level.

Example trade-off:

Strongest ambience match, but one participant may have a 47-minute journey.

The system must not invent venue attributes.

---

## 11. Voting and Decision Modes

### 11.1 Simple Vote

Each participant selects one venue.

### 11.2 Ranked Vote

Participants rank the available venues.

### 11.3 Approval Vote

Participants select every venue they would accept.

### 11.4 Veto Mode

Each participant receives one veto.

### 11.5 Blind Vote

Votes remain hidden until:

* Everyone votes.
* The organizer closes voting.
* The timer expires.

### 11.6 Battle Mode

Two venues are shown side by side.

Participants repeatedly choose between pairs until one venue remains.

### 11.7 Swipe Mode

Participants swipe:

* Right for interested.
* Left for reject.
* Up for strong preference.
* Down for veto.

### 11.8 Spin the Map

The app randomly selects from the eligible top venues.

The spinner must never include venues that violate hard constraints.

### 11.9 Decision Timer

The organizer may start a timer:

* 30 seconds.
* One minute.
* Two minutes.
* Five minutes.

When the timer ends, WhereTo applies the selected decision rule.

---

## 12. Gamification

The product should feel playful, competitive, and collaborative.

### 12.1 Game Lobby

Before recommendations are generated, participants appear in a shared lobby.

The lobby displays:

* Avatars.
* Ready status.
* Preference completion.
* Participant count.
* Plan category.
* Countdown.
* Group status.

Example status:

4 of 5 players ready.

### 12.2 Map Unlock Animation

As users join, the app reveals possible meeting regions.

Once enough preferences are submitted:

Meeting zone unlocked.

### 12.3 Venue Cards

Venues should appear as game-style cards with attributes such as:

* Travel.
* Price.
* Vibe.
* Rating.
* Fairness.
* Novelty.

### 12.4 Compatibility Score

The app may display:

Group Match: 87%

This should be positioned as an understandable recommendation metric, not a scientifically precise measurement.

### 12.5 Reroll Tokens

The group may receive a limited number of rerolls per plan.

Reroll reasons include:

* Too expensive.
* Too far.
* Too familiar.
* Too crowded.
* Not exciting.
* Need metro access.
* Need parking.
* Need better vegetarian options.

The next result set should respond to the selected reason.

### 12.6 Badges

Possible badges:

* Decision Maker.
* Bangalore Explorer.
* Budget Hero.
* Metro Master.
* Hidden Gem Hunter.
* Night Owl.
* Brunch Squad.
* Reliable Planner.
* Wild Card Winner.

### 12.7 Group Streaks

Groups may build a streak by successfully completing plans.

The feature should avoid penalizing users heavily when plans do not happen.

### 12.8 Experience Points

Users may earn points for:

* Completing a plan.
* Joining a vote.
* Visiting a new area.
* Trying a new category.
* Providing post-plan feedback.
* Finalizing before the timer expires.

Points should not affect the fairness or quality of venue recommendations.

---

## 13. Visual Design Direction

### 13.1 Overall Style

WhereTo should have a modern, dark, energetic, game-themed interface.

The experience should feel like a combination of:

* Multiplayer game lobby.
* Futuristic city-navigation interface.
* Nightlife discovery platform.
* Competitive group decision tool.

The design should feel premium and playful rather than childish.

### 13.2 Visual Characteristics

* Dark background.
* High-contrast surfaces.
* Neon accent elements.
* Animated map markers.
* Glowing location zones.
* Bold typography.
* Responsive card interactions.
* Progress indicators.
* Participant avatars.
* Smooth map transitions.
* Game-style status messaging.
* Subtle particle or grid effects.
* Animated recommendation reveal.
* Victory animation after confirmation.

### 13.3 Suggested Color System

#### Base Colors

* Near-black background.
* Dark charcoal panels.
* Deep navy map surfaces.
* Soft grey borders.
* White primary text.
* Muted grey secondary text.

#### Accent Colors

A controlled combination of:

* Electric purple.
* Neon blue.
* Cyan.
* Lime green.
* Hot pink.
* Amber for warnings.

Accent colors should communicate state rather than appearing everywhere.

Example:

* Purple for primary actions.
* Cyan for map routes.
* Green for confirmed or ready.
* Pink for Wild Card.
* Amber for trade-offs.
* Red for vetoes or errors.

### 13.4 Typography

Typography should be:

* Bold.
* Geometric.
* Modern.
* Highly legible.
* Slightly futuristic.

Large headings may use a distinctive display font.

Body text should use a clean sans-serif font.

### 13.5 Motion

Motion should include:

* Participant marker entrance.
* Meeting-zone reveal.
* Recommendation card flip.
* Vote submission response.
* Reroll animation.
* Countdown.
* Winner reveal.
* Route tracing.
* Confirmation celebration.

Users who enable reduced-motion settings should receive a simplified experience.

### 13.6 Map Design

The map should use:

* Dark roads.
* Muted building areas.
* Minimal map labels.
* Neon participant markers.
* Glowing candidate zones.
* Bright selected routes.
* Distinct venue icons.
* Animated pulse around the selected venue.

### 13.7 Sound

Optional sound effects may later be added for:

* Participant joined.
* Lobby ready.
* Recommendations unlocked.
* Vote submitted.
* Winner selected.

Sound should be disabled by default on web or clearly user-controlled.

---

## 14. Key Screens

### 14.1 Landing Page

Main headline:

Nobody knows where to go. WhereTo does.

Primary action:

Create a Plan

Secondary action:

Join a Plan

The page should show:

* Dark animated Bangalore map.
* Participant markers.
* Meeting-zone animation.
* Three venue cards.
* A short three-step explanation.

### 14.2 Plan Creation Screen

Inputs:

* Plan title.
* Activity.
* Date.
* Time.
* Group size.
* Initial budget.
* Initial location.

The interface should feel like creating a multiplayer session.

Primary action:

Create Lobby

### 14.3 Group Lobby

Elements:

* Lobby title.
* Participant avatars.
* Ready indicators.
* Share link.
* Response progress.
* Countdown.
* Activity icon.
* Start button.

Primary action:

Find Our Spot

### 14.4 Participant Setup

Sections:

* Choose location.
* Choose transport.
* Set travel limit.
* Set budget.
* Select preferences.
* Mark constraints.

Primary action:

Ready Up

### 14.5 Group Map

Elements:

* Participant regions.
* Overlapping travel areas.
* Suggested zone.
* Submission status.
* Animated scan or calculation state.

Status examples:

* Scanning Bangalore.
* Comparing travel routes.
* Matching group preferences.
* Finding the fairest zone.

### 14.6 Recommendation Reveal

Three venue cards appear with animation.

Each card contains:

* Venue image.
* Recommendation label.
* Group match score.
* Price.
* Rating.
* Average travel time.
* Longest travel time.
* Vibe tags.
* Reason for recommendation.
* View on map.
* Vote button.

### 14.7 Battle Screen

Two venues appear side by side.

Users select one.

The winning venue advances until the final round.

### 14.8 Voting Screen

Elements:

* Venue cards.
* Participant vote status.
* Timer.
* Anonymous-vote status.
* Vote progress.
* One-veto indicator.

### 14.9 Winner Screen

The selected venue appears with:

* Victory animation.
* Confirmed venue.
* Date.
* Time.
* Meeting point.
* Participant routes.
* Cost.
* Directions.
* Calendar action.
* Share action.
* Backup venue.

Headline:

Plan locked.

### 14.10 Plan History

Later versions may include:

* Completed plans.
* Cancelled plans.
* Saved venues.
* Group statistics.
* Badges.
* Favorite neighborhoods.
* Most-used activity categories.

---

## 15. MVP Scope

### 15.1 MVP Hypothesis

Groups will use location optimization and lightweight voting to finalize plans faster than through normal messaging conversations.

### 15.2 MVP Features

* Bangalore map.
* Plan creation.
* Guest invite links.
* Group lobby.
* Participant location input.
* Approximate location privacy.
* Transport mode.
* Maximum travel time.
* Budget.
* Activity selection.
* Basic preference collection.
* Restaurant, café, pub, brewery, and activity recommendations.
* Meeting-zone calculation.
* Three venue recommendations.
* Recommendation explanations.
* Individual travel estimates.
* Simple voting.
* One reroll.
* Winner confirmation.
* Shareable final plan.
* Basic dark game-themed interface.
* Post-plan feedback.

### 15.3 Excluded from MVP

* Native mobile application.
* Payment processing.
* Bill splitting.
* Direct venue booking.
* Advanced rewards economy.
* Public profiles.
* Messaging.
* Multiple cities.
* Multi-stop plans.
* Advanced personalization.
* Full event ticket integration.
* Corporate management tools.

---

## 16. Phase Two Features

* Ranked-choice voting.
* Battle mode.
* Swipe mode.
* Spin the Map.
* Blind voting.
* More reroll controls.
* Saved groups.
* Saved locations.
* Calendar integration.
* Weather-aware recommendations.
* Event discovery.
* Venue booking links.
* Badges and experience points.
* Group history.
* Group preference learning.
* Public transport improvements.
* Live traffic recalculation.
* Backup venue selection.

---

## 17. Phase Three Features

* Additional cities.
* Native mobile apps.
* Multi-stop itineraries.
* Automated booking.
* Group expense splitting.
* Group wallet.
* Corporate team planning.
* Recurring plans.
* AI-generated full evenings.
* Venue partnerships.
* Sponsored placements with clear labels.
* Dynamic group personalization.
* Friends and social groups.
* City exploration challenges.

---

## 18. User Stories

### 18.1 Organizer Creates a Plan

As an organizer, I want to create and share a planning lobby quickly so that I do not have to coordinate everyone manually.

Acceptance criteria:

* A plan can be created without registration.
* A unique invitation link is generated.
* The organizer can edit the plan.
* The organizer can see participant progress.
* The organizer can start recommendations.

### 18.2 Participant Joins

As a participant, I want to join through a link without creating an account.

Acceptance criteria:

* The lobby works on mobile web.
* Joining takes less than two minutes.
* Most inputs are optional.
* Preferences can be edited before voting begins.

### 18.3 Participant Protects Location

As a participant, I want my exact address to remain private.

Acceptance criteria:

* Exact coordinates are used only for calculations.
* Other users see only the selected approximate area.
* The user can remove location information.
* Exact coordinates are not exposed in shared page data.

### 18.4 Group Understands Recommendations

As a participant, I want to understand why a place was recommended.

Acceptance criteria:

* Every recommendation provides clear reasons.
* Travel times are visible.
* Costs are visible.
* Trade-offs are shown.
* Confidence is shown when data is uncertain.

### 18.5 Group Finalizes a Winner

As an organizer, I want the app to determine a result from participant votes.

Acceptance criteria:

* Participants can vote.
* Vote status is shown.
* The winning venue is calculated automatically.
* Ties are handled.
* The plan can be confirmed and shared.

---

## 19. Metrics

### 19.1 North-Star Metric

Percentage of created plans that result in a confirmed venue and time.

### 19.2 Activation Metrics

* Plan creation completion.
* Invite-link sharing rate.
* Participant join rate.
* Preference submission rate.
* Recommendation generation rate.

### 19.3 Decision Metrics

* Median time to confirmed plan.
* Average number of rerolls.
* Percentage finalized from the first set.
* Vote completion rate.
* Tie rate.
* Plan-confirmation rate.

### 19.4 Recommendation Metrics

* Recommendation selection rate.
* Hard-constraint violation rate.
* User-reported relevance.
* Travel-time accuracy.
* Budget accuracy.
* Recommendation confidence.
* Venue rejection reasons.

### 19.5 Retention Metrics

* Second plan created within 30 days.
* Groups completing multiple plans.
* Repeat organizer rate.
* Participant-to-organizer conversion.
* Monthly active groups.

### 19.6 Guardrail Metrics

* Plan abandonment rate.
* Location-permission denial.
* API cost per plan.
* Recommendation latency.
* Venue data error reports.
* Privacy complaints.
* Low-confidence result rate.

---

## 20. Product Experiments

**Experiment 1: Three Recommendations Versus Five**

Test whether three options reduce decision time without reducing satisfaction.

**Experiment 2: Map-First Versus Card-First**

Test whether map-first improves fairness understanding and card-first improves decision speed.

**Experiment 3: Visible Versus Blind Voting**

Test whether blind voting creates more honest participant choices.

**Experiment 4: Ranked Options Versus Named Roles**

Compare numerical rankings with labels such as Best Overall, Most Convenient, and Wild Card.

**Experiment 5: Midpoint Versus Fairness Optimization**

Test whether travel-time fairness produces higher acceptance than a geographic midpoint.

**Experiment 6: Recommendation Explanation**

Test whether explanation visibility increases trust and selection.

**Experiment 7: Decision Timer**

Test whether a short timer improves completion.

**Experiment 8: Game Lobby**

Test whether multiplayer lobby visuals improve participant submission rates.

**Experiment 9: Reroll Limits**

Test whether limiting rerolls reduces endless browsing.

---

## 21. Edge Cases

WhereTo should handle:

* Only one participant submits information.
* Participants have the same location.
* Participants are extremely far apart.
* No venue satisfies every hard constraint.
* No common time exists.
* A venue closes before the selected time.
* A participant changes location.
* A participant joins after voting starts.
* A participant refuses location access.
* Venue price is unavailable.
* Routing fails.
* Recommendations receive equal votes.
* A selected venue becomes unavailable.
* One participant has a much lower budget.
* Participants prefer incompatible activities.
* The group is larger than expected.
* Traffic changes significantly.

### No Valid Result

WhereTo should explain why no suitable recommendation exists.

Example:

No venue currently meets every requirement. Increasing Rhea's maximum travel time from 25 to 35 minutes would unlock 14 options.

The system may suggest:

* Increasing travel time.
* Increasing budget.
* Changing category.
* Changing date or time.
* Allowing another neighborhood.
* Relaxing a soft preference.

---

## 22. Privacy Requirements

* Exact location should be encrypted in transit and at rest.
* Exact location should never be displayed to other participants by default.
* Guest location data should expire automatically.
* Users should be able to delete their location.
* Invite links should use unguessable identifiers.
* Organizer controls should be protected.
* Shared pages should expose only required data.
* Location permission requests should explain their purpose.
* The product should collect the minimum required personal information.

---

## 23. Accessibility Requirements

The application should support:

* Keyboard navigation.
* Screen readers.
* High contrast.
* Text alternatives for map results.
* Non-color status indicators.
* Large touch targets.
* Reduced-motion mode.
* Scalable text.
* Clear form labels.
* Accessible voting controls.

The game-themed design must not reduce usability.

---

## 24. Performance Requirements

* Initial interface should load quickly on mobile networks.
* Map interactions should remain smooth.
* Recommendation generation should normally complete within five seconds.
* Voting updates should appear within two seconds.
* Venue cards should load progressively.
* The application should remain usable when some third-party data is unavailable.

---

## 25. Business Model Options

Potential future revenue streams include:

* Reservation affiliate fees.
* Event-ticket affiliate fees.
* Premium planning features.
* Corporate subscriptions.
* Venue analytics.
* Clearly labeled sponsored venues.
* Premium itinerary generation.
* Concierge planning.

Sponsored venues must:

* Be clearly labeled.
* Never override hard constraints.
* Remain separate from organic ranking.
* Never become the top result solely because of payment.

---

## 26. Launch Criteria

WhereTo is ready for public beta when:

* Users can create a plan.
* Users can share a lobby.
* Participants can join without an account.
* Participants can submit locations and preferences.
* Exact participant locations remain private.
* The system can calculate feasible meeting zones.
* The system can generate three suitable recommendations.
* Travel time is shown for each participant.
* Every recommendation is explained.
* Participants can vote.
* A winner can be confirmed.
* The final plan can be shared.
* Core flows work on mobile browsers.
* Empty-result and error states are handled.
* Analytics are operational.
* The dark game-themed interface is visually consistent.

---

## 27. Example Scenario

Four friends are located in Whitefield, HSR Layout, Malleshwaram, and Indiranagar.

They want to meet on Saturday at 7:30 PM.

Their requirements are:

* Pub or brewery.
* Maximum budget of ₹1,500 per person.
* Vegetarian options.
* Metro access.
* Maximum travel time of 50 minutes.
* Lively atmosphere.

WhereTo calculates feasible meeting zones and presents:

**Best Overall**

* MG Road.
* Average travel time: 34 minutes.
* Longest travel time: 45 minutes.
* Estimated cost: ₹1,300.
* Five-minute walk from metro.
* Strong vegetarian menu.
* Group match: 91%.

**Most Convenient**

* Indiranagar.
* Average travel time: 29 minutes.
* Longest travel time: 49 minutes.
* Estimated cost: ₹1,450.
* Group match: 86%.

**Wild Card**

* Koramangala.
* Average travel time: 38 minutes.
* Longest travel time: 50 minutes.
* Live music.
* Estimated cost: ₹1,500.
* Group match: 82%.

The group enters Battle Mode, selects the MG Road venue, and receives:

Plan locked.

The final plan includes directions, date, time, participant travel estimates, and a WhatsApp-ready share card.

---

## 28. Long-Term Vision

WhereTo can evolve from a venue-selection tool into a complete group decision platform.

It may eventually answer:

* Where should we meet?
* What should we do?
* When is everyone available?
* How should everyone travel?
* What should we book?
* How much will it cost?
* How should the expense be split?
* Where should we go afterward?

The core product promise should remain:

WhereTo does not merely show options. It helps groups make fair, fast, and enjoyable decisions.
