module Hello exposing (..)

import Html exposing (Html, text, h1)
import Http
import Time exposing (Time, second)

import Nezaldi
import Decoders exposing (..)
import Messages exposing (..)
import MainView

main =
    Html.program
       { init = init
       , view = view
       , update = update
       , subscriptions = subscriptions
       }

-- MODEL

type alias Model =
  { transactions: Nezaldi.TransactionSet
  , viewState: MainView.ViewState
  }

init : (Model, Cmd Msg)
init = (
    { transactions = Nezaldi.emptySet
    , viewState = MainView.initialState
    }
    , Cmd.none
    )

-- UPDATE

update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
      Tick t ->
        (model, getTransactions model)
      NewTransactions (Ok newTrans) ->
        ({ model | transactions = newTrans }, Cmd.none)
      NewTransactions (Err _) ->
        (model, Cmd.none)
      Select selected ->
        ({ model | viewState = selectTrans selected model.viewState }, Cmd.none)

selectTrans : Int -> MainView.ViewState -> MainView.ViewState
selectTrans i viewState =
    { viewState | selected = Just i }

getTransactions : Model -> Cmd Msg
getTransactions model =
  let
    url =
      "/api/transactions"

    request =
      Http.get url decodeTransactionSet
  in
    Http.send NewTransactions request

-- SUBSCRIPTIONS

subscriptions : Model -> Sub Msg
subscriptions model =
  Time.every (2 * second) Tick

-- VIEW

view : Model -> Html Msg
view model =
  MainView.view model.transactions model.viewState

