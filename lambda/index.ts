/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
import { SkillBuilders, getRequestType, getIntentName } from 'ask-sdk-core'
import { HandlerInput, RequestHandler, ErrorHandler as AlexaErrorHandler } from 'ask-sdk-core'
import { Response, IntentRequest } from 'ask-sdk-model'
import { dateToEasternTime, generateGoodbye } from './src/helpers'
import { getLunchMessageForToday, getLunchMessageForTomorrow } from './src/lunch'

const LaunchRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'
  },
  handle(handlerInput: HandlerInput): Response {
    const intent = handlerInput.requestEnvelope.request as IntentRequest

    const speakOutput = getLunchMessageForToday() + '. <break time="200ms" />' + generateGoodbye(true)

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(true)
      .getResponse()
  }
}

const AskAboutLunchIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && getIntentName(handlerInput.requestEnvelope) === 'AskAboutLunchIntent'
  },
  handle(handlerInput: HandlerInput): Response {
    const intent = handlerInput.requestEnvelope.request as IntentRequest
    const dateSlot = intent.intent.slots?.date?.value  // format: 2025-02-03

    // determine if date is today or tomorrow
    const today = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)


    const date = dateSlot ? dateToEasternTime(dateSlot) : new Date()

    console.log('dateSlot :>> ', dateSlot)
    console.log('date :>> ', date)
    console.log('today :>> ', today)
    console.log('tomorrow :>> ', tomorrow)

    let speakOutput: string

    if (date.getDate() === today.getDate()) {
      speakOutput = getLunchMessageForToday()
    } else if (date.getDate() === tomorrow.getDate()) {
      speakOutput = getLunchMessageForTomorrow()
    } else {
      speakOutput = `I can only tell you about lunch for today or tomorrow.`
    }

    speakOutput += '. <break time="200ms" />' + generateGoodbye(true)

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .withShouldEndSession(true)
      .getResponse()
  }
}

const HelpIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
  },
  handle(handlerInput: HandlerInput): Response {
    const speakOutput = 'You can ask me what\'s for lunch! You can also say today or tomorrow.'

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse()
  }
}

const CancelAndStopIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && (getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
        || getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent')
  },
  handle(handlerInput: HandlerInput): Response {
    const speakOutput = generateGoodbye(true)

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse()
  }
}

/* *
 * FallbackIntent triggers when a customer says something that doesn't map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ignored in locales that do not support it yet 
 * */
const FallbackIntentHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent'
  },
  handle(handlerInput: HandlerInput): Response {
    const speakOutput = 'Sorry, I don\'t know about that. Please try again.'

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse()
  }
}

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest'
  },
  handle(handlerInput: HandlerInput): Response {
    console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`)
    // Any cleanup logic goes here.
    return handlerInput.responseBuilder.getResponse() // notice we send an empty response
  }
}

/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler: RequestHandler = {
  canHandle(handlerInput: HandlerInput): boolean {
    return getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
  },
  handle(handlerInput: HandlerInput): Response {
    const intentName = getIntentName(handlerInput.requestEnvelope)
    const speakOutput = `You just triggered ${intentName}`

    return handlerInput.responseBuilder
      .speak(speakOutput)
      //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
      .getResponse()
  }
}

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler: AlexaErrorHandler = {
  canHandle(): boolean {
    return true
  },
  handle(handlerInput: HandlerInput, error: Error): Response {
    const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.'
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`)

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse()
  }
}

/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
export const handler = SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    AskAboutLunchIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler)
  .addErrorHandlers(
    ErrorHandler)
  .withCustomUserAgent('arlington-lunch/0.0.2')
  .lambda()