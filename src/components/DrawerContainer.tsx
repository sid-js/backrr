"use client"

import * as React from 'react';
import { Drawer, DrawerContent, DrawerSelectEvent } from '@progress/kendo-react-layout';
import { useRouter } from 'next/navigation';
import { create } from 'zustand'
import { homeIcon, dollarIcon } from '@progress/kendo-svg-icons';

const items = [
    { text: 'Dashboard', selected: true, route: '/dashboard', svgIcon: homeIcon },
    { text: 'Sponsors', route: '/dashboard/sponsors', svgIcon: dollarIcon },
];

interface DrawerState {
    isDrawerOpen: boolean;
    setIsDrawerOpen: (isDrawerOpen: boolean) => void;
}
export const useDrawerStateStore = create<DrawerState>((set) => ({
    isDrawerOpen: false,
    setIsDrawerOpen: (isDrawerOpen: boolean) => set({ isDrawerOpen }),
}))

const DrawerContainer = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const router = useRouter();
    const isDrawerOpen = useDrawerStateStore((state) => state.isDrawerOpen);
    const setIsDrawerOpen = useDrawerStateStore((state) => state.setIsDrawerOpen);
    const [selected, setSelected] = React.useState(items.findIndex((x) => x.selected === true));

    const handleClick = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    const onSelect = (e: DrawerSelectEvent) => {
        router.push(e.itemTarget.props.route);
        setSelected(e.itemIndex);
    };

    return (
        <div>
            <Drawer
                expanded={isDrawerOpen}
                position={'start'}
                mode={'push'}
                width={200}
                items={items.map((item, index) => ({
                    ...item,
                    selected: index === selected
                }))}
                onSelect={onSelect}
                mini={true}
                drawerClassName='drawer'
            >
                <DrawerContent style={{
                    padding: "20px",
                    width: "100%",
                    maxWidth: "100%",
                    overflowX: "hidden",
                }}>{children}</DrawerContent>
            </Drawer>
            <style>
                {`
                    .drawer {
                        padding-top: 20px;
                        height: 100%;
                    }
                    
                `}
            </style>
        </div>

    );
};

export default DrawerContainer;
