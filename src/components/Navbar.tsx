"use client"
import { AppBar, AppBarSection, AppBarSpacer, Avatar } from '@progress/kendo-react-layout';
import { Badge, BadgeContainer } from '@progress/kendo-react-indicators';
import { bellIcon, menuIcon } from '@progress/kendo-svg-icons';
import { Button } from '@progress/kendo-react-buttons';
import Image from 'next/image';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const {
        data: session,
        isPending,
        error,
        refetch
    } = authClient.useSession()
    const router = useRouter();
    return (
        <AppBar themeColor="primary">
            <AppBarSection>
                <Button type="button" fillMode="flat" svgIcon={menuIcon} />
            </AppBarSection>

            <AppBarSpacer style={{ width: 4 }} />

            <AppBarSection>
                <Image src="/backrr-logo-white.svg" width={150} height={50} alt="logo" />
            </AppBarSection>
            <AppBarSpacer style={{ width: 32 }} />
            <AppBarSpacer />

            {session && (<AppBarSection className="actions">
                <Button type="button" fillMode="flat" svgIcon={bellIcon}>
                    <BadgeContainer>
                        <Badge rounded="full" themeColor="primary" size="small" position="inside" />
                    </BadgeContainer>
                </Button>
            </AppBarSection>)}

            {session ? (
                <>
                    <AppBarSection>
                        <span className="k-appbar-separator" />
                    </AppBarSection>
                    <AppBarSection>
                        <Avatar type="image">
                            <img src="/user-placeholder.jpg" alt="KendoReact Layout Kendoka Avatar" />
                        </Avatar>
                    </AppBarSection>
                </>) : (<>
                    <AppBarSection>
                        <Button onClick={() => router.push('/signup')} type="button" themeColor="base">Get Started / Login</Button>
                    </AppBarSection>
                </>)}

        </AppBar>
    )
}