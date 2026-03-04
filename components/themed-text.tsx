import { StyleSheet, Text, type TextProps } from 'react-native';

export type ThemedTextProps = TextProps & {
    text: string,
    lightColor?: string,
    darkColor?: string,
    type?: "default" | "title" | "defaultSemibold" | "link";
}

export function ThemedText({
    text,
    style,
    lightColor,
    darkColor,
    type = 'default',
    ...props
}: ThemedTextProps)
{
    
    return(
        <Text style={[
            type === "default" ? styles.default : undefined,
            type === "defaultSemibold" ? styles.defaultSemibold : undefined,
        ]} {...props}>
            {text}
        </Text>
    )
}

const styles = StyleSheet.create({
    default: {
        fontSize: 16,
        lineHeight: 24
    },
    defaultSemibold: {
        fontSize: 16,
        lineHeight: 24,
        fontWeight: '600'
    }
})

