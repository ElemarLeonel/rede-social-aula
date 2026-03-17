// useState: hook para gerenciar estados (React/React Native)
import { PropsWithChildren, useState } from "react";
import { View, TouchableOpacity, Text } from 'react-native';

export function Collapsible({
    children,
    title
}: PropsWithChildren & { title: string }){

    // open: Variável de alteração
    // isOpen: função para alterar o valor da variável
    const [isOpen, setIsOpen] = useState(false);

    return(
        <View>
            <TouchableOpacity 
                style=''             
                onPress={() => setIsOpen((value) => !value)}
                activeOpacity={0.8}
            >
                <Text>
                    {title}
                </Text>
            </TouchableOpacity>
            { isOpen && <View>
                {children}
            </View> }
        </View>
    )
}