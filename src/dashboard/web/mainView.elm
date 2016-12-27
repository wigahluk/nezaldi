module MainView exposing (view)

import Html exposing (..)
import Html.Attributes exposing (..)
import Messages exposing (Msg)
import Nezaldi

-- Read more about Elm and styles in https://voyageintech.wordpress.com/2015/10/25/composing-styles-in-elm/

(=>) = (,)

card : List (Html msg) -> Html msg
card children =
    div [
        style
            [ "position" => "relative"
            , "margin" => "0.5rem 0 1rem 0"
            , "transition" => "box-shadow .25s"
            , "border-radius" => "2px"
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
    div [
        style
            [ "width" => "85%"
            , "max-width" => "1280px"
            , "margin" => "auto"
            ]
        ] children

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

view : Nezaldi.TransactionSet -> Html Msg
view model =
  container
      [ h1 [] [text "Nezaldi"]
      , hr [] []
      , summary model
      , hr [] []
      , h2 [] [text "Latest transactions"]
      , div [] (List.map transaction (List.reverse <| List.sortBy (\t -> t.times.sourceRequestTime) model.transactions))
      ]

summary : Nezaldi.TransactionSet -> Html Msg
summary model =
    card [ cardContent [
            h2 [] [text "Sumary"],
            kvPair [] "Total Trafic" ( toString model.traffic ),
            kvPair [] "Total Errors" ( toString model.errors )
        ]]

transaction : Nezaldi.Transaction -> Html Msg
transaction model =
    card [ cardContent [
        kvPair [] "Code" (toString model.code),
        kvPair [] "Type" model.responseType,
        kvPair [] "Source" model.sourceUrl,
        kvPair [] "Target" model.targetUrl,
        div [] [
            h3 [] [text "Headers"],
            h4 [] [text "Sent from Client"],
            div [] [text (toString model.headers.source)],
            h4 [] [text "Sent to Target"],
            div [] [text (toString model.headers.target)],
            h4 [] [text "Sent to Client"],
            div [] [text (toString model.headers.response)]
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