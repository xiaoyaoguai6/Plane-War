describe('用户登录测试', () => {
  it('首页用户登录', () => {
    cy.visit('http://localhost:8080/');
    cy.get('#name').clear().type('李小二');
    cy.get('#pwd').clear().type('1234');
    cy.get('#submit').click();
  });
});
