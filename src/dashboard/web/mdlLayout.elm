module MdlLayout exposing (..)

import Html exposing (..)
import Html.Attributes exposing (..)

(=>) = (,)

layout : List (Html msg) -> Html msg
layout children =
    div [
        class "mdl-layout mdl-layout--fixed-header"
        ] children

layoutHeader : String -> Html msg
layoutHeader title =
    header [
        class "mdl-layout__header headerBar"
        ] [
            div [
                class "mdl-layout__header-row"
            ] [
                span [
                    class "mdl-layout-title"
                ] [ text title ]
            ]
        ]

layoutContent : List (Html msg) -> Html msg
layoutContent children =
    div [
        class "mdl-layout__content"
        ]
        [
        div [
            class "mdl-grid"
            ]
            [
            div [
                class "mdl-cell mdl-cell--12-col"
                ]
                children
            ]
        ]

fatList : List (Html msg) -> Html msg
fatList children =
    div [
        style
            [ "position" => "relative"
            , "margin" => "0.5rem 0 1rem 0"
            ]
        ] children

fatListItem : List (Attribute msg) -> List (Html msg) -> Html msg
fatListItem attributes children =
    div attributes [
        div [
            style
                [ "position" => "relative"
                , "background-color" => "#ffffff"
                , "border-bottom" => "1px solid rgba(0,0,0,0.2)"
                , "background-color" => "#ffffff"
                , "transition" => "box-shadow .25s"
                , "box-shadow" => "0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2)"
                ]
            ] children ]