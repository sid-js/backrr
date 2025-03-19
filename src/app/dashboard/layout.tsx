import DrawerContainer from "@/components/DrawerContainer";


export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <DrawerContainer>
            {children}
        </DrawerContainer>
    );
}
