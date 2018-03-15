const chalk = require('chalk')
const cliSpinner = require('cli-spinner')
const inquirer = require('inquirer')
const scrapeIt = require('scrape-it')
const Spinner = cliSpinner.Spinner
const log = console.log
const error = chalk.bold.red

const promptUserForQuery = async () => {
  const questions = [
    {
      name: 'query',
      type: 'input',
      message: 'What do you want to look up?',
      validate: value => {
        if (!value.length) {
          return 'Please enter your query.'
        } else {
          return true
        }
      }
    }
  ]
  return inquirer.prompt(questions)
}

const printSearchResults = searchResults => {
  searchResults.forEach(searchResult => {
    log(chalk
      `
        {blue ${searchResult.title}}
        {green ${searchResult.url}}`
    )
  })
}

const getSearchResults = async (query) => {
  const response = await scrapeIt(`https://www.startpage.com/do/search?q=${query}`, {
    searchResults: {
      listItem: 'div.result',
      data: {
        title: 'span.result_url_heading',
        url: {
          selector: 'a',
          attr: 'href'
        }
      }
    }
  })
  return response.data.searchResults.reverse()
}

const run = async () => {
  const userResponse = await promptUserForQuery()
  const query = userResponse.query

  const spinner = new Spinner(`Getting search results for "${query}"...`)
  spinner.start()

  try {
    const searchResults = await getSearchResults(query)
    printSearchResults(searchResults)
  } catch (err) {
    log(error('Oops!', err))
  } finally {
    spinner.stop()
  }
}

run()