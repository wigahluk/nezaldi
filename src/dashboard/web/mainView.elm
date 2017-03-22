module MainView exposing (view, ViewState, initialState)

import MdlLayout exposing (..)
import Html exposing (..)
import Html.Events exposing (..)
import Html.Attributes exposing (..)
import Messages exposing (Msg)
import Nezaldi
import Maybe exposing (..)

-- Read more about Elm and styles in https://voyageintech.wordpress.com/2015/10/25/composing-styles-in-elm/

(=>) = (,)

type alias ViewState =
    { selected: Maybe Int
    }

initialState : ViewState
initialState =
    { selected = Nothing
    }

card : List (Html msg) -> Html msg
card children =
    div [
        style
            [ "position" => "relative"
            , "margin" => "0.5rem 0 1rem 0"
            , "transition" => "box-shadow .25s"
            , "border-radius" => "2px"
            , "background-color" => "#ffffff"
            , "box-shadow" => "0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)"
            ]
        ] children

cardContent : List (Html msg) -> Html msg
cardContent children =
    div [
        style
            [ "padding" => "20px"
            , "border-radius" => "0 0 2px 2px"
            ]
        ] children

container : List (Html msg) -> Html msg
container children =
    layout [ layoutHeader "Nezaldi Dashboard"
        , layoutContent children ]

tCell : List (Html msg) -> Html msg
tCell children =
    div [
        style
            [ "padding" => "15px 5px"
            , "display" => "table-cell"
            , "text-align" => "left"
            , "vertical-align" => "middle"
            , "border" => "none"
            ]
    ] children

tRow : List (Html msg) -> Html msg
tRow children =
    div [
        style
            [ "display" => "table-row"
            ]
    ] children

-- VIEW

view : Nezaldi.TransactionSet -> ViewState -> Html Msg
view model vState =
  container
      [ summary model
      , h2 [] [text "Latest transactions"]
      , fatList (List.map (thinOrFat vState.selected) (List.reverse <| List.sortBy (\t -> t.times.sourceRequestTime) model.transactions))
      ]

summary : Nezaldi.TransactionSet -> Html Msg
summary model =
    card [ cardContent [
            h2 [] [text "Sumary"],
            kvPair [] "Total Trafic" ( toString model.traffic ),
            kvPair [] "Total Errors" ( toString model.errors )
        ]]

thinOrFat : Maybe Int -> Nezaldi.Transaction -> Html Msg
thinOrFat selected =
    let
        choice : Int -> Nezaldi.Transaction -> Html Msg
        choice i t = if i == t.id then fatTransaction t else thinTransaction t
    in
        withDefault thinTransaction <| Maybe.map choice selected

thinTransaction : Nezaldi.Transaction -> Html Msg
thinTransaction model =
    fatListItem [ onClick <| Messages.Select model.id ] [ cardContent [
            kvPair [] "Code" (toString model.code),
            kvPair [] "Type" model.responseType,
            kvPair [] "Source" model.sourceUrl
        ]]

fatTransaction : Nezaldi.Transaction -> Html Msg
fatTransaction model =
    fatListItem [
        onClick <| Messages.Select model.id,
        style [
            "margin" => "1rem 0 1rem 0"
            ]
        ] [ cardContent [
        kvPair [] "Code" (toString model.code),
        kvPair [] "Type" model.responseType,
        kvPair [] "Source" model.sourceUrl,
        kvPair [] "Target" model.targetUrl,
        kvPair [] "RegEx" model.regex,
        div [] [
            h3 [] [text "Headers"],
            h4 [] [text "Sent from Client"],
            div [ style [ "overflow-wrap" => "break-word" ] ] [text (toString model.headers.source)],
            h4 [] [text "Sent to Target"],
            div [ style [ "overflow-wrap" => "break-word" ] ] [text (toString model.headers.target)],
            h4 [] [text "Sent to Client"],
            div [ style [ "overflow-wrap" => "break-word" ] ] [text (toString model.headers.response)]
        ],
        div [] [
            h3 [] [text "Times"],
            text (toString model.times)
        ]
    ]]

kvPair : List (Attribute Msg) -> String -> String -> Html Msg
kvPair attrs name value =
    tRow [
        tCell [text name],
        tCell [text value]
    ]