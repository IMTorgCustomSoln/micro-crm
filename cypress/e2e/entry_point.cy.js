describe('Entry Point', () => {
    it('successfully loads', () => {
      cy.visit('/')
    })
    it('enter account info', () => {
      cy.visit('/')
      cy.get('.btn-outline-light').click();
      cy.get('#account-name').type('Test User');
      cy.get('#account-modal___BV_modal_footer_ > .btn').click();
      cy.get('.btn-outline-light').click();
      cy.get('#account-name').click();
    })
    it.only('load test data', () => {
      cy.visit('/')
      cy.get('.btn-outline-light').click();
      cy.get('#admin-state').should('have.value', '')          //TODO: '' should be 'Admin Mode is On'
      cy.get('.close').click();
      cy.get('#btnSaveContinue').click();
      cy.get('.no-li-dot > :nth-child(1) > .btn').click();
      cy.get('#selected-project').should($el => { 
        expect($el[0].innerText).to.contain('Selected Project: Handmade Metal Shoes')
        //cy.log($el[0].innerText) 
        })
    })
  })