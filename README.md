

# Micro CRM

What it is and what it supports.


## Use Case

* manage user data, including
  - status in pipeline
  - role, use case, and pain point
  - correspondence, interactions, and reaction
* aggregate
  - project status
  - alerts for next steps
* determine
  - who hasn't received an email
  - who needs a follow-up
  - what pain points need to be addressed
* auto generate appropriate emails
* improve your art by logging and reviewing events over time
* visualize contacts by
  - references
  - organizational hierarchy
  - timeline of interactions


## Test Functionality

* Pinia, Pinia-ORM
* offline-first pwa
* perform database design
* Bootstrap-vue [support](https://bootstrap-vue.org/vue3) 


## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

This project builds into a single file: ./dist/index.html using the plugin with command:

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```


## Workflows

* Select Project
  - Select View > Project
  - Click on project row
* CRUD views
  - Select View > (any)
  - New (any)
  - Table column Actions > Edit
  - Table column Actions > Delete
* Log Interaction (demo, meeting, etc.)
  - Select View > Contact
  - (contacts filtered by selected project) 
  - Click on each contact row that were in interaction
  - Click Log Interaction
  - Rows display as Participants
  - Type comments
  - Press Add / Update  TODO:<<<<
* Set / Update Lifecycle Plan
  - Select View > Lifecycle
  - Table row 'default', column Action > Edit
  - Steps table, click on any step
  - Select Placeholders > Add
  - Write associated email form and add Placeholder at cursor position
  - Update Step
  - Add / Update Lifecycle
* HOW DOES projec-person-status table fit in???
* View Next Steps table
  - time since past due
* Prepare many individual emails
  - all within same step
* View all previous events,interactions in a timeline
* View use cases + pain point
* View contacts, referrals by firm hierarchy
* View Reports
  - project accomplishmnents
  - ...




## References

* router views may be useful, but is unnecessary.  Some good explanations of dynamic layouts are the following:
  - https://markus.oberlehner.net/blog/dynamic-vue-layout-components/



## TODO

* diagram: Customer Lifecycle with Feedback-Response Loop


_Minor_

* TypeError: Converting circular structure to JSON
* ~~if project is selected, then that row should still be highlighted after returning from another page~~
* ~~Lifecycle view, table col Steps: space between items in array~~
* add selected checkmark to tables, [ref](https://stackoverflow.com/questions/66669105/how-do-i-get-the-indices-of-current-selected-rows-in-bootstrap-vues-table-when)
* ModalLifecycle: style 'Steps:' table
* Contacts Table
  - ~~populate Log Interaction, with only one row selected~~
  - ~~before project selection, remove ReferredBy~~
  - after project selection, should show PersonProjStatus (need new table)


_New_

* If project selected, 'Log Event' and 'New Feedback' buttons show (shown on all views)
* Feedback
  - if no contact selected, fill-in with Account info
* Event 
  - if Type 'Dev' then possible to choose Feedback that addresses it

* Left side-bar reports
  - ~~setup~~
* General
  - Project is selectable (or not - show all) within each page.  Independent of Main Selection
  - Sections: ??? history, current, future
* Report, Projects
  - Previous Events Summary: for selected time period: events grouped by project, filterable by Type (Discussion, Development, ...)
  - Project Feedback: list of all feedback, filterable by Type (UseCase, Feature Request, Issue, ...) => ?export to trello
  - Project Timesheet: hours of events, with project rows and column days
  - Contact Next Steps: lists next step sorted by
    + time elapsed since deadline
    + title (importance)
  - Contacts, Org View
    + based on simple model of org structure populated from titles / positions
    + need a modal to describe org structure model, or load org structure
    + select lines connecting referrals, order / timeline, etc.
    
* Data I/O
  - in 'Account', turn-on 'Admin' mode (the following are only available in Admin)
  - in Data I/O, add 'Clear' all data 
  - in Data I/O, add populate with 'Demo' data















END
