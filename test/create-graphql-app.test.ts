import CreateGraphqlApp from "../src/create-graphql-app"

/**
 * Dummy test
 */
describe("Dummy test", () => {
  it("works if true is truthy", () => {
    expect(true).toBeTruthy()
  })

  it("CreateGraphqlApp is instantiable", () => {
    expect(new CreateGraphqlApp()).toBeInstanceOf(CreateGraphqlApp)
  })
})
