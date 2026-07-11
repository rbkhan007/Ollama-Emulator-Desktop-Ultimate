pragma Singleton

import QtQuick 2.15

QtObject {
    property bool dark: true

    property color bgPrimary:   dark ? "#0f0f1a" : "#f5f5fa"
    property color bgSecondary: dark ? "#1a1a2e" : "#e8e8f0"
    property color bgTertiary:  dark ? "#252540" : "#dcdce6"
    property color surface:     dark ? "#1e1e36" : "#ffffff"
    property color surfaceAlt:  dark ? "#2a2a48" : "#f0f0f6"

    property color textPrimary:   dark ? "#e8e8f0" : "#1a1a2e"
    property color textSecondary: dark ? "#a0a0c0" : "#555570"
    property color textMuted:     dark ? "#606080" : "#9999aa"

    property color accentPrimary:   "#6c63ff"
    property color accentSecondary: "#00d4aa"
    property color accentTertiary:  "#ff6b9d"
    property color accentGlow:      "#6c63ff88"

    property color border:       dark ? "#2a2a48" : "#d0d0e0"
    property color borderLight:  dark ? "#353555" : "#e0e0ea"
    property color shadow:       dark ? "#00000055" : "#00000015"
    property color overlay:      dark ? "#00000066" : "#00000033"

    property int radiusSmall:    4
    property int radiusMedium:   8
    property int radiusLarge:    16
    property int radiusXL:       24

    property real sidebarWidth:  220
    property real topBarHeight:  56
    property real animationDuration: 250

    property font fontHeading: Qt.font({ family: "Segoe UI", pixelSize: 24, weight: Font.DemiBold })
    property font fontSubheading: Qt.font({ family: "Segoe UI", pixelSize: 16, weight: Font.Medium })
    property font fontBody: Qt.font({ family: "Segoe UI", pixelSize: 13 })
    property font fontSmall: Qt.font({ family: "Segoe UI", pixelSize: 11 })
    property font fontCode: Qt.font({ family: "Cascadia Code,Consolas", pixelSize: 12 })
}
