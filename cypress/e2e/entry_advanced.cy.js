describe('Entry entering data and performing advanced operations', () => {
    it.only('Contact: display ReferredBy', {includeShadowDom: true}, () => {
      cy.visit('/')
      //add project
      cy.get('#btnNewProject').click();
      cy.get('#nested-street').clear('MyPrj');
      cy.get('#nested-street').type('MyPrj');
      cy.get('#project-status').select('Active');
      cy.get('#project-startdate').click();
      cy.get('#project-startdate__dialog_').contains('span', '3').click()
      cy.get('#project-enddate').click();
      cy.get('#project-enddate__dialog_').contains('span', '4').click()
      cy.get('#mySelect2').select('default');
      cy.get('#new-project-modal___BV_modal_footer_ > .btn').click();
      cy.get('table').get('td').should($el => {
        expect($el[0].innerText).to.contain('MyPrj')
      })
      //add contact
      cy.get('#__BVID__8__BV_toggle_').click();
      cy.get(':nth-child(2) > .dropdown-item').click();
      cy.get('#btnNewContact').click();
      cy.get('#nested-street').type('MyLead');
      cy.get('#__BVID__199 > .col > #nested-state').select('USER ACCOUNT');
      cy.get('#__BVID__225 > .col > #nested-country').select(['MyPrj']);
      cy.get('#new-contact-modal___BV_modal_footer_ > .btn').click();
      cy.get('table').get('td').should($el => {
        expect($el[0].innerText).to.contain('MyLead')
      })
      //select project
      cy.get('#__BVID__8__BV_toggle_').click();
      cy.get(':nth-child(1) > .dropdown-item').click();
      cy.get('table').get('tbody').get('tr').get('td').then($el => {
        $el[0].click()
      })
      cy.get('#selected-project').should($el => {
        expect($el[0].innerText).to.contain('Selected Project: MyPrj')
      })
      //display ReferredBy
      cy.get('#__BVID__8__BV_toggle_').click();
      cy.get(':nth-child(2) > .dropdown-item').click();
      cy.get('table').get('td').should($el => {
        expect($el[2].innerText).to.contain('USER ACCOUNT')
      })
      //add more contacts
      cy.get('#btnNewContact').click();
      cy.get('#nested-street').clear('C');
      cy.get('#nested-street').type('Contact2');
      cy.get('#__BVID__320 > .col > #nested-state').select('MyLead');
      cy.get('#__BVID__347 > .col > #nested-country').select(['MyPrj']);
      cy.get('#new-contact-modal___BV_modal_footer_ > .btn').click();
      cy.get('#btnNewContact').click();
      cy.get('#nested-street').clear('C');
      cy.get('#nested-street').type('Contact3');
      cy.get('#__BVID__378 > .col > #nested-state').select('MyLead');
      cy.get('#__BVID__406 > .col > #nested-country').select(['MyPrj']);
      cy.get('#new-contact-modal___BV_modal_footer_ > .btn').click();
      cy.get('#btnNewContact').click();
      cy.get('#nested-street').clear('C');
      cy.get('#nested-street').type('Contact4');
      cy.get('#__BVID__437 > .col > #nested-state').select('Contact3');
      cy.get('#__BVID__466 > .col > #nested-country').select(['MyPrj']);
      cy.get('#new-contact-modal___BV_modal_footer_ > .btn').click();
      cy.get('table').find("tr").should((row) => {
        expect(row.length).equal(5)
      });
      //select contacts then clear selections
      cy.get('table > tbody > tr:nth-child(2) > td').then($el => {
        $el[0].click()
      })
      cy.get('table > tbody > tr:nth-child(3) > td').then($el => {
        $el[0].click()
      })
      cy.get('#contacts').should($el => {
        expect($el[0].innerText).to.contain('Contacts: 2');
      })
      cy.get('#clearSelections').click()
      cy.get('#contacts').should('not.exist')
    })

})