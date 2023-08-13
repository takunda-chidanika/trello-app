'use client'
import {Todo, TypedColumn} from "@/typings";
import {DraggableProvidedDraggableProps, DraggableProvidedDragHandleProps} from "react-beautiful-dnd";
import {XCircleIcon} from "@heroicons/react/24/solid";
import {useBoardStore} from "@/store/BoardStore";
import {useEffect, useState} from "react";
import getURL from "@/lib/getURL";
import Image from "next/image";

type Props = {
    todo: Todo;
    index: number;
    id: TypedColumn;
    innerRef: (element: HTMLElement | null) => void;
    draggableProps: DraggableProvidedDraggableProps;
    dragHandleProps: DraggableProvidedDragHandleProps | null | undefined;
}

const TodoCard = ({todo, index, id, innerRef, draggableProps, dragHandleProps}: Props) => {
    const deleteTodo = useBoardStore(state => state.deleteTodo);
    const [imageUrl, setImageUrl] = useState<string>(
        ""
    );
    
    useEffect(() => {
        if (todo.image) {
            const fetchImage = async () => {
                const url = await getURL(todo.image!);
                if (url){
                    setImageUrl(url.toString());
                }
            }

            fetchImage();
        }

    }, [todo]);

    return (
        <div
            className={`bg-white rounded-md space-y-2 drop-shadow-md`}
            {...draggableProps} {...dragHandleProps} ref={innerRef}
        >
            <div className={`flex justify-between items-center p-5`}>
                <h1>{todo.title}</h1>
                <button className={`text-red-500 hover:text-red-700`}>
                    <XCircleIcon
                        onClick={() => deleteTodo(index, todo, id)}
                        className={`w-10 h-10 ml-5`}
                    />
                </button>
            </div>
            {
                imageUrl &&(
                    <Image src={imageUrl} alt={`Task Image`}
                           width={400}
                           height={200}
                           className={`w-full object-contain rounded-b-md`}/>
                )
            }
        </div>
    );
}

export default TodoCard;