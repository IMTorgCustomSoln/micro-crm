describe('report: next steps', () => {
  it('passes', () => {
    cy.visit('/')
    cy.get('#btnSaveContinue').click();
    cy.get('.load-demo-data > .btn').click();
    cy.get('#__BVID__43__row_IP8fjeI0OXuR66QXq0t4t > [aria-colindex="1"]').click();
    cy.get('#__BVID__43__row_IP8fjeI0OXuR66QXq0t4t > [aria-colindex="1"]').click();
    cy.get('.icon').click();
    cy.get(':nth-child(5) > :nth-child(2) > li').click();
    cy.get('.icon').click();
    cy.get('#tbl-next-steps > :nth-child(2) > :nth-child(1)').should($el => { 
      expect($el[0].innerText).to.contain('-54')
      });
    cy.get('#tbl-next-steps > :nth-child(2) > :nth-child(2)').should($el => { 
       expect($el[0].innerText).to.contain('-43')
      });
    cy.get('#tbl-next-steps > :nth-child(2) > :nth-child(3)').should($el => { 
       expect($el[0].innerText).to.contain('-26')
      });
    cy.get('#tbl-next-steps > :nth-child(2) > :nth-child(4)').should($el => { 
      expect($el[0].innerText).to.contain('-21')
     });
    cy.get('#tbl-next-steps > :nth-child(2) > :nth-child(5)').should($el => { 
      expect($el[0].innerText).to.contain('0')
     });
  })
})