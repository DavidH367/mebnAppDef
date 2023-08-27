import { Button } from "@nextui-org/react";
export const PrimaryButton = ({
    text,
    onClick,
    className:customClassName,
    disabled 
}) => {
    return (
        <Button size={"lg"} color={"primary"} onPress={onClick} disabled={disabled}>{text}</Button>
    );
}
export const SecondaryButton = ({
    text,
    onClick,
    className:customClassName
}) => {
    return (
        <Button size={"lg"} color={"secondary"} onPress={onClick}>{text}</Button>
    );
}

