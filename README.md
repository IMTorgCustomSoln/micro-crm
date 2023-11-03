

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

_Current_

* TypeError: Converting circular structure to JSON
* if project is selected, then that row should still be highlighted after returning from another page
* Lifecycle view, table col Steps: space between items in array
* ModalLifecycle: style 'Steps:' table
* Contacts Table
  - populate Log Interaction, wiht only one row selected
  - before project selection, remove ReferredBy
  - after project selection, should show PersonProjStatus (need new table)

_New_

* ProjectsView, if project selected, 'Log Event' button shows
* event reports
  - project summary for selected time period: events grouped by project
  - timesheet: hours of events, with project rows and column days
* user reports
  - next step
