import { useAtom, useAtomValue } from "jotai";
import { accordionState, editorState } from "../store/atoms/editor";
import { SearchBar, Accordion } from "./SideBarComponent";
import { CDNLinks } from "../db/Links";
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import {templates} from "../db/Templates.js";


function MainComponent() {
    const editor = useAtomValue(editorState);

    if (!editor) {
        console.warn(`Editor is not initialized yet.`)
        return (
            <div>
                Loading ...
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full h-full">
            <SideBar />
            <Tiptap editor={editor} />
        </div>
    )
}


const DraggableImage = ({ id, name, link, insertSVG }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `draggable-${id}`,
        data: {
            link,
            name,
            type: 'image'
        }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        cursor: 'grab',
        opacity: transform ? 0.5 : 1,
    };

    const handleDragStart = (e) => {
        e.dataTransfer.setData('text/plain', JSON.stringify({ link, name }));
        e.dataTransfer.effectAllowed = 'copy';
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            draggable
            onDragStart={handleDragStart}
            onClick={(e) => insertSVG(e, link)}
            className="w-18 flex flex-col items-center p-2 hover:bg-slate-200 hover:rounded"
        >
            <img className="w-[3rem]" src={link} alt={name} />
            <h2 className="text-sm">{name}</h2>
        </div>
    );
};

const SideBar = () => {
    const [isSelected, setIsSelected] = useAtom(accordionState);
    const editor = useAtomValue(editorState);

    if (!editor) {
        console.warn(`Editor is not initialized yet.`)
        return (
            <div>
                Loading ...
            </div>
        )
    }

    function insertSVG(event, link) {
        if (event) event.preventDefault();

        const { from } = editor.state.selection;

        console.log("Starting Positon", from);

        editor.commands.insertContent({
            type: 'flexibleImage',
            attrs: {
                src: link,
                width: 50,
                height: 50,
                style: 'display: inline-block'
            }
        });

        editor.commands.focus();
    }

    return (
        <div className="w-full bg-slate-50 h-screen gap-4 flex flex-col border-r-1 border-gray-950/30">
            <div className="p-4">
                <img
                    className="w-10"
                    src="src/assets/3_Logo/MD.svg"
                    alt="Logo"
                />
            </div>

            <SearchBar />

            <div className="overflow-y-auto max-h-full w-full mx-auto custom-scrollbar">

                <Accordion
                    id={"Templates"}
                    isSelected={isSelected["Templates"]}
                    content={
                        <div className={`${isSelected["Templates"] ? "max-h-[60vh]" : "max-h-0"} grid grid-cols-2 justify-items-center p-2 gap-2 w-full overflow-y-auto overflow-x-hidden transition-all duration-300 border-b-1 border-gray-800/30 hover:shadow-xs hide-scrollbar`}>
                            {templates.map((template) => (
                                <button
                                    key={template.id}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (!editor) {
                                            console.error("Editor not available");
                                            return;
                                        }

                                        editor.chain()
                                            .clearContent()
                                            .insertContent(template.content)
                                            .focus('end')
                                            .run();
                                    }}
                                    className="w-full flex flex-col items-center p-2 hover:bg-gray-200 hover:rounded dark:hover:bg-gray-800 transition-colors"
                                >
                                    <div className="w-full h-24 bg-white dark:bg-gray-700 border rounded-md mb-2 overflow-hidden flex items-center justify-center p-2">
                <pre className="text-xs text-gray-500 dark:text-gray-400 text-center whitespace-pre-wrap overflow-hidden line-clamp-3">
                  {template.content.split('\n')[0]}
                    {template.content.includes('\n') ? "..." : ""}
                </pre>
                                    </div>
                                    <h2 className="text-sm text-center font-medium">{template.name}</h2>
                                </button>
                            ))}
                        </div>
                    }
                />

                <Accordion id={"Programming Languages"} isSelected={isSelected["Programming Languages"]} content={
                    <div className={`${isSelected["Programming Languages"] ? "max-h-[60vh]" : "max-h-0"} grid grid-cols-3 
          justify-items-center p-3 gap-3 w-full overflow-y-auto overflow-x-hidden transition-all 
          duration-300 border-b-1 border-slate-300 hover:shadow-xs hide-scrollbar`}>
                        {CDNLinks.filter(({category}) => category === "Programming Languages").map(({id, name, link}) => (
                            <DraggableImage
                                key={id}
                                id={id}
                                name={name}
                                link={link}
                                insertSVG={insertSVG}
                            />
                        ))}
                    </div>
                } />

                <Accordion id={"Frontend Development"} isSelected={isSelected["Frontend Development"]} content={
                    <div className={`${isSelected["Frontend Development"] ? "max-h-[60vh]" : "max-h-0"} grid grid-cols-3 justify-items-center p-3 gap-3 w-full overflow-y-auto overflow-x-hidden transition-all duration-300 border-b-1 border-gray-800/30 hover:shadow-xs hide-scrollbar`}>
                        {CDNLinks.filter(({category}) => category === "Frontend Development").map(({id, name, link}) => (
                            <DraggableImage
                                key={id}
                                id={id}
                                name={name}
                                link={link}
                                insertSVG={insertSVG}
                            />
                        ))}
                    </div>
                } />

                <Accordion id={"Backend Development"} isSelected={isSelected["Backend Development"]} content={
                    <div className={`${isSelected["Backend Development"] ? "max-h-[60vh]" : "max-h-0"} grid grid-cols-3 justify-items-center p-3 gap-3 w-full overflow-y-auto overflow-x-hidden transition-all duration-300 border-b-1 border-gray-800/30 hover:shadow-xs hide-scrollbar`}>
                        {CDNLinks.filter(({category}) => category === "Backend Development").map(({id, name, link}) => (
                            <DraggableImage
                                key={id}
                                id={id}
                                name={name}
                                link={link}
                                insertSVG={insertSVG}
                            />
                        ))}
                    </div>
                } />

                <Accordion id={"Databases & Data Storage"} isSelected={isSelected["Databases & Data Storage"]} content={
                    <div className={`${isSelected["Databases & Data Storage"] ? "max-h-[60vh]" : "max-h-0"} grid grid-cols-3 justify-items-center p-3 gap-3 w-full overflow-y-auto overflow-x-hidden transition-all duration-300 border-b-1 border-gray-800/30 hover:shadow-xs hide-scrollbar`}>
                        {CDNLinks.filter(({category}) => category === "Databases & Data Storage").map(({id, name, link}) => (
                            <DraggableImage
                                key={id}
                                id={id}
                                name={name}
                                link={link}
                                insertSVG={insertSVG}
                            />
                        ))}
                    </div>
                } />

                <Accordion id={"Cloud & DevOps"} isSelected={isSelected["Cloud & DevOps"]} content={
                    <div className={`${isSelected["Cloud & DevOps"] ? "max-h-[60vh]" : "max-h-0"} grid grid-cols-3 justify-items-center p-3 gap-3 w-full overflow-y-auto overflow-x-hidden transition-all duration-300 border-b-1 border-gray-800/30 hover:shadow-xs hide-scrollbar`}>
                        {CDNLinks.filter(({category}) => category === "Cloud & DevOps").map(({id, name, link}) => (
                            <DraggableImage
                                key={id}
                                id={id}
                                name={name}
                                link={link}
                                insertSVG={insertSVG}
                            />
                        ))}
                    </div>
                } />

                <Accordion id={"Software & Tools"} isSelected={isSelected["Software & Tools"]} content={
                    <div className={`${isSelected["Software & Tools"] ? "max-h-[60vh]" : "max-h-0"} grid grid-cols-3 justify-items-center p-3 gap-3 w-full overflow-y-auto overflow-x-hidden transition-all duration-300 border-b-1 border-gray-800/30 hover:shadow-xs hide-scrollbar`}>
                        {CDNLinks.filter(({category}) => category === "Software & Tools").map(({id, name, link}) => (
                            <DraggableImage
                                key={id}
                                id={id}
                                name={name}
                                link={link}
                                insertSVG={insertSVG}
                            />
                        ))}
                    </div>
                } />

                <Accordion id={"Operating Systems"} isSelected={isSelected["Operating Systems"]} content={
                    <div className={`${isSelected["Operating Systems"] ? "max-h-[60vh]" : "max-h-0"} grid grid-cols-3 justify-items-center p-3 gap-3 w-full overflow-y-auto overflow-x-hidden transition-all duration-300 border-b-1 border-gray-800/30 hover:shadow-xs hide-scrollbar`}>
                        {CDNLinks.filter(({category}) => category === "Operating Systems").map(({id, name, link}) => (
                            <DraggableImage
                                key={id}
                                id={id}
                                name={name}
                                link={link}
                                insertSVG={insertSVG}
                            />
                        ))}
                    </div>
                } />

                <Accordion id={"Game Development"} isSelected={isSelected["Game Development"]} content={
                    <div className={`${isSelected["Game Development"] ? "max-h-[60vh]" : "max-h-0"} grid grid-cols-3 justify-items-center p-3 gap-3 w-full overflow-y-auto overflow-x-hidden transition-all duration-300 border-b-1 border-gray-800/30 hover:shadow-xs hover:bg-gray-200/10 hide-scrollbar`}>
                        {CDNLinks.filter(({category}) => category === "Game Development").map(({id, name, link}) => (
                            <DraggableImage
                                key={id}
                                id={id}
                                name={name}
                                link={link}
                                insertSVG={insertSVG}
                            />
                        ))}
                    </div>
                } />
            </div>
        </div>
    )
}

export default SideBar;