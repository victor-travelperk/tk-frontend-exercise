import fetchMock from "fetch-mock"

fetchMock.config.overwriteRoutes = true

afterEach(() => {
  fetchMock.reset()
})

export default fetchMock