Steps:
1. Define high level architecture
    1.1 Main components of each of automation
    1.2 How each component interacts with each other
2. Define data processing flow, how does data get transformend and sent from the ui to the backend and vice versa
    2.1 Define the testing stratgey to validate just the transformation logic
3. Define the UI components and library that will be needed
    3.1 Create a basic UI structure to validate the changes
    3.2 Consider the data model used to store the state
4. Define execution boundaries to break up the work in to sizable chunks and commits that have high confidence and clear scope before moving on to the next phase



Automation has the following properties:
- name
- description
- enabled
- trigger
- condition
- actions

For each trigger there are three types:
- Device Event
    - comesOnline
    - goesOffline
    - hardwareChange
- Threshold: greater than, less than, equal to
    - cpuUsage
    - memoryUsage
    - diskUsage
- Schedule
    - MINUTES
    - HOURS
    - DAYS

Once a trigger fires a condition is evaluated, if the condition is true then the actions are executed.
Conditions are evaluated using a tree structure, where each node is a condition or a group of conditions.
Conditions are represnted as nested object arrays, with a value stating whether its and/or

When a condition triggers all actions execute:
- Send Notification: sends an email with a subject and body to specific recipients, this can be a simple composition and function call for now with enhancement to include an email client
- Run Script: executes a script on the device


 ## UI Components:
 - Automation list
    - Use an email style view that combines all key fields into a single card and narrows to the left when the editor is open
    - There is a button at the top left for adding a new automation that can also collapse to the left when the editor is open
    - the editor will be a side panel that slides in from the right and contains a read only view, clicking edit allows inline editing of the automation rule
    - the top part of the side panel contains all the metadata and the description that can be edited inline
    - the bottom portion contains the rule builder
 - Rule builder
    - What UI elements are needed for the rule builder?


### Trigger configuration
The trigger has three different types:
- Device Event
- Threshold
- Schedule
Each can be represnted as a dropdown
For Device Event there is a dropdown with the following options:
- ONLINE
- OFFLINE
- HARDWARE_CHANGE

For Threshold there is a dropdown with the following options:
- CPU_USAGE
- MEMORY_USAGE
- DISK_USAGE
this is followed by a Comparison Operator dropdown with the following values:
  - EQUALS
  - NOT_EQUALS
  - GREATER_THAN
  - LESS_THAN
  - GREATER_THAN_OR_EQUALS
  - LESS_THAN_OR_EQUALS
  - CONTAINS
  - NOT_CONTAINS
then followed by a numerical input for the threshold value - validate as a float / decimal
then followed by a duration input for the duration as well as a time unit (seconds, minutes, hours, days), will need to convert to seconds for the API - validate as an integer

For Schedule there is a dropdown with the following options:
Dropdown with the frequency:
- MINUTES
- HOURS
- DAYS
Numerical Integer input for the interval, do I want a zod limit for this perphaps like 1 - 999 

### Action configuration
This will be shown as a configurable list with options to add or remove an action,
actions will be shown in order and can be dragged to reorder

#### Send Notification
- recipients: email formatted correctly and presented in a list
- subject: string input
- body: text area input

#### Run Script
- script name: text input for script name and validation that it is a file name
- arguments: an array of arguments to pass to the script, can be represnted as a list of text inputs
- timeout: numerical input for timeout in seconds, or minutes that can be converted to seconds

### Mutations
- 3 mutations for create, update, delete
- each mutation should handle invalidating/updating the cache for the automation list

### Error handling
- Use link error handling apollo middleware to log API errors to the console

## Caching:
- How will caching and invalidation work for the UI?
- How will refreshing work for the UI? Will there be a refresh button?
- Show when the data was last refreshed