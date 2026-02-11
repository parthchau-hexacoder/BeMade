import { useEffect, useRef } from 'react';
import { useAppActions } from '../../app/hooks/useAppActions';
import { ChairControl } from '../chairs/ChairControl';
import { OrderSummary } from '../component/OrderSummary';
import { BaseControl } from './BaseControl';
import { BaseMaterialControl } from './BaseMaterialControl';
import { TopMaterialControls } from './TopMaterialControl';
import { TopShapeControl } from './TopShapeControl';
import { TopSizeControl } from './TopSizeControl';

const SECTION_IDS = [
    'base',
    'base-colour',
    'top-colour',
    'top-shape',
    'dimension',
    'chair',
    'summary'
];

const TableControls = () => {
    const { ui } = useAppActions();
    const containerRef = useRef<HTMLDivElement | null>(null);
    const sectionElementsRef = useRef<HTMLElement[]>([]);

    useEffect(() => {
        if (!containerRef.current) return;

        sectionElementsRef.current = SECTION_IDS
            .map((id) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];

        if (sectionElementsRef.current.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((entry) => entry.isIntersecting)
                    .sort((a, b) => (a.boundingClientRect.top > b.boundingClientRect.top ? 1 : -1));
                if (visible[0]?.target?.id) {
                    ui.setActiveNavId(visible[0].target.id);
                }
            },
            {
                root: containerRef.current,
                threshold: 0.35
            }
        );

        sectionElementsRef.current.forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, [ui]);

    return (
        <div ref={containerRef} className='table-controls-layout w-full flex-1 min-h-0 overflow-y-auto scroll-smooth md:w-[35%] md:flex-none md:h-full'>
            <section id="base">
                <BaseControl />
            </section>
            <section id="base-colour">
                <BaseMaterialControl />
            </section>
            <section id="top-colour">
                <TopMaterialControls />
            </section>
            <section id="top-shape">
                <TopShapeControl />
            </section>
            <section id="dimension">
                <TopSizeControl />
            </section>
            <section id="chair">
                <ChairControl />
            </section>
            <section id="summary">
                <OrderSummary />
            </section>
        </div>
    );
}

export default TableControls;
