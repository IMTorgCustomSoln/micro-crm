describe('Entry using demo data', () => {
    it('Site: successfully loads', () => {
      cy.visit('/')
    })
    it('Account: enter account info', () => {
      cy.visit('/')
      cy.get('.btn-outline-light').click();
      cy.get('#account-name').type('Test User');
      cy.get('#account-modal___BV_modal_footer_ > .btn').click();
      cy.get('.btn-outline-light').click();
      cy.get('#account-name').click();
    })
    it('Demo data: load test data', () => {
      cy.visit('/')
      cy.get('.btn-outline-light').click();
      cy.get('#admin-state').should('have.value', '')          //TODO: '' should be 'Admin Mode is On'
      cy.get('.close').click();
      cy.get('#btnSaveContinue').click();
      cy.get('.no-li-dot > :nth-child(1) > .btn').click();
      cy.get('#selected-project').should($el => { 
        expect($el[0].innerText).to.contain('Selected Project: Handmade Metal Shoes')
        })
    })
    it('Events: add, edit, delete without partcipants', {includeShadowDom: true}, () => {
      //load demo data
      cy.visit('/')
      cy.get('.btn-outline-light').click();
      cy.get('#admin-state').should('have.value', '')          //TODO: '' should be 'Admin Mode is On'
      cy.get('.close').click();
      cy.get('#btnSaveContinue').click();
      cy.get('.no-li-dot > :nth-child(1) > .btn').click();
      cy.get('#selected-project').should($el => { 
        expect($el[0].innerText).to.contain('Selected Project: Handmade Metal Shoes')
        })
      //add event
      cy.get('#__BVID__8__BV_toggle_').click();
      cy.get(':nth-child(2) > .dropdown-item').click();
      cy.get('#eventBtn').click();
      cy.get('#__BVID__156 > .col > #nested-street').select('Meeting');
      cy.get('#event-modal___BV_modal_footer_ > .btn').click();
      cy.get('#sidebar-icon').click();
      cy.get(':nth-child(2) > :nth-child(1) > li').click();
      cy.get('#sidebar-icon').click();
      cy.get('table tr:nth-child(5) td:nth-child(5)').should($el => {
        expect($el[0].innerText).to.contain('(1) - USER ACCOUNT')
      })
      //edit event
      cy.get('table tr:nth-child(5) td:nth-child(9) > span > button').then($el => {
        $el[0].click()
      })
      cy.get('#__BVID__266 > .col > #nested-street').select('Planning');
      cy.get('#event-modal___BV_modal_footer_ > .btn').click();
      cy.get('table tr:nth-child(5) td:nth-child(3)').should($el => {
        expect($el[0].innerText).to.contain('Planning')
      })
      //delete event
      cy.get('table tr:nth-child(5) td:nth-child(9) > span > button').then($el => {
        $el[1].click()
      })
      cy.get('table tr:nth-child(5)').should('not.exist')
    })
    it('Events: add, edit, delete with partcipants', {includeShadowDom: true}, () => {
      //load demo data
      cy.visit('/')
      cy.get('.btn-outline-light').click();
      cy.get('#admin-state').should('have.value', '')          //TODO: '' should be 'Admin Mode is On'
      cy.get('.close').click();
      cy.get('#btnSaveContinue').click();
      cy.get('.no-li-dot > :nth-child(1) > .btn').click();
      cy.get('#selected-project').should($el => { 
        expect($el[0].innerText).to.contain('Selected Project: Handmade Metal Shoes')
        })
      //select participants
      cy.get('#__BVID__8__BV_toggle_').click();
      cy.get(':nth-child(2) > .dropdown-item').click();
      cy.get('#__BVID__121__row_VUoz14MCr4L6oJ15Nxm05 > [aria-colindex="2"]').click();
      cy.get('#__BVID__121__row_nLou5foP_4HeB5vbGH63I > [aria-colindex="2"]').click();
      //add event
      cy.get('#__BVID__8__BV_toggle_').click();
      cy.get(':nth-child(2) > .dropdown-item').click();
      cy.get('#eventBtn').click();
      cy.get('#__BVID__157 > .col > #nested-street').select('Meeting');
      cy.get('#event-modal___BV_modal_footer_ > .btn').click();
      cy.get('#sidebar-icon').click();
      cy.get(':nth-child(2) > :nth-child(1) > li').click();
      cy.get('#sidebar-icon').click();
      cy.get('table tr:nth-child(5) td:nth-child(5)').should($el => {
        expect($el[0].innerText).to.contain('(2) - Yvette Medhurst, Henrietta Barton IV')
      })
      //edit event
      cy.get('table tr:nth-child(5) td:nth-child(9) > span > button').then($el => {
        $el[0].click()
      })
      cy.get('#__BVID__267 > .col > #nested-street').select('Planning');
      cy.get('#event-modal___BV_modal_footer_ > .btn').click();
      cy.get('table tr:nth-child(5) td:nth-child(3)').should($el => {
        expect($el[0].innerText).to.contain('Planning')
      })
      //delete event
      cy.get('table tr:nth-child(5) td:nth-child(9) > span > button').then($el => {
        $el[1].click()
      })
      cy.get('table tr:nth-child(5)').should('not.exist')

    })
    it('Feedback: add, edit, delete without participant', {includeShadowDom: true}, () => {
      //load demo data
      cy.visit('/')
      cy.get('.btn-outline-light').click();
      cy.get('#admin-state').should('have.value', '')          //TODO: '' should be 'Admin Mode is On'
      cy.get('.close').click();
      cy.get('#btnSaveContinue').click();
      cy.get('.no-li-dot > :nth-child(1) > .btn').click();
      cy.get('#selected-project').should($el => { 
        expect($el[0].innerText).to.contain('Selected Project: Handmade Metal Shoes')
        })
      //add feedback
      cy.get('#__BVID__8__BV_toggle_').click();
      cy.get(':nth-child(2) > .dropdown-item').click();
      cy.get('#feedbackBtn').click();
      cy.get('#__BVID__156 > .col > #nested-street').select('USER ACCOUNT');
      cy.get('#__BVID__162 > .col > #nested-street').select('Feature');
      cy.get('#feedback-modal___BV_modal_footer_ > .btn').click();
      cy.get('#sidebar-icon').click();
      cy.get('.px-3 > :nth-child(2) > :nth-child(2) > li').click();
      cy.get('#sidebar-icon').click();
      cy.get('table tr:nth-child(3) td:nth-child(7)').should($el => {
        expect($el[0].innerText).to.contain('USER ACCOUNT')
      })
      //edit feedback
      cy.get('table tr:nth-child(3) td:nth-child(8) > span > button').then($el => {
        $el[0].click()
      })
      cy.get('#__BVID__227 > .col > #nested-street').select('UseCase');
      cy.get('#feedback-modal___BV_modal_footer_ > .btn').click();
      cy.get('table tr:nth-child(3) td:nth-child(2)').should($el => {
        expect($el[0].innerText).to.contain('UseCase')
      })
      //delete feedback
      cy.get('table tr:nth-child(3) td:nth-child(8) > span > button').then($el => {
        $el[1].click()
      })
      cy.get('table tr:nth-child(3)').should('not.exist')
    })
    it('Feedback: add, edit, delete with participant', {includeShadowDom: true}, () => {
      //load demo data
      cy.visit('/')
      cy.get('.btn-outline-light').click();
      cy.get('#admin-state').should('have.value', '')          //TODO: '' should be 'Admin Mode is On'
      cy.get('.close').click();
      cy.get('#btnSaveContinue').click();
      cy.get('.no-li-dot > :nth-child(1) > .btn').click();
      cy.get('#selected-project').should($el => { 
        expect($el[0].innerText).to.contain('Selected Project: Handmade Metal Shoes')
        })
      //select participant
      cy.get('#__BVID__8__BV_toggle_').click();
      cy.get(':nth-child(2) > .dropdown-item').click();
      cy.get('#__BVID__121__row_VUoz14MCr4L6oJ15Nxm05 > [aria-colindex="1"]').click();
      //add feedback
      cy.get('#feedbackBtn').click();
      cy.get('#__BVID__163 > .col > #nested-street').select('Feature');
      cy.get('#feedback-modal___BV_modal_footer_ > .btn').click();
      cy.get('#sidebar-icon').click();
      cy.get('.px-3 > :nth-child(2) > :nth-child(2) > li').click();
      cy.get('#sidebar-icon').click();
      cy.get('table tr:nth-child(3) td:nth-child(7)').should($el => {
        expect($el[0].innerText).to.contain('Yvette Medhurst')
      })
      //edit feedback
      cy.get('table tr:nth-child(3) td:nth-child(8) > span > button').then($el => {
        $el[0].click()
      })
      cy.get('#__BVID__228 > .col > #nested-street').select('UseCase');
      cy.get('#feedback-modal___BV_modal_footer_ > .btn').click();
      cy.get('table tr:nth-child(3) td:nth-child(2)').should($el => {
        expect($el[0].innerText).to.contain('UseCase')
      })
      //delete feedback
      cy.get('table tr:nth-child(3) td:nth-child(8) > span > button').then($el => {
        $el[1].click()
      })
      cy.get('table tr:nth-child(3)').should('not.exist')
    })

  })