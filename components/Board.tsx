'use client'
// @ts-nocheck
import {DragDropContext, Droppable, DropResult} from 'react-beautiful-dnd';
import {useEffect} from "react";
import {useBoardStore} from "@/store/BoardStore";
import ColumnCard  from "@/components/ColumnCard";


const Board = () => {
    const [board, getBoard, setBoardState, updateTodo] =
        useBoardStore((state)=>
            [state.board,state.getBoard, state.setBoardState, state.updateTodo])

    useEffect(()=>{
        getBoard();
    },[getBoard]);

    console.log(board)

    function handleOnDragEnd( result : DropResult) {
        const {destination, source, type} = result;
        if (!destination) return;
        if(type=="column"){
            const entries = Array.from(board.columns.entries());
            const [removed] = entries.splice(source.index, 1);
            entries.splice(destination.index, 0, removed);
            const rearrangedColumn = new Map(entries)
            setBoardState({
                ...board, columns: rearrangedColumn,
            });
        }
        const columns = Array.from(board.columns);
        const startColIndex = columns[Number(source.droppableId)];
        const finishColIndex = columns[Number(destination.droppableId)];


        const startCol: Column = {
            id: startColIndex[0],
            todos: startColIndex[1].todos,
        }
        const finishCol:Column = {
            id: finishColIndex[0],
            todos: finishColIndex[1].todos,
        }

        if (!startCol || !finishCol) return;
        if(source.index === destination.index && startCol === finishCol) return;

        const newTodos = startCol.todos;
        const [todoMoved] =  newTodos.splice(source.index, 1);
        if(startCol.id === finishCol.id){
            newTodos.splice(destination.index, 0, todoMoved);
            const newCol = {
                id:startCol.id,
                todos: newTodos,
            };
            const newColumns = new Map(board.columns);
            newColumns.set(startCol.id, newCol);
            setBoardState({...board, columns: newColumns});
        }
        else {
            const finishTodos = Array.from(finishCol.todos);
            finishTodos.splice(destination.index, 0, todoMoved);
            const newColumns = new Map(board.columns);
            const newCol = {
                id:startCol.id,
                todos: newTodos,
            };

            newColumns.set(startCol.id, newCol);
            newColumns.set(finishCol.id, {
                id: finishCol.id,
                todos: finishTodos,
            });
            updateTodo(todoMoved, finishCol.id);
            setBoardState({...board, columns: newColumns});


        }
    }

    return (
        <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId={`board`} direction={`horizontal`} type={`column`}>
                {(provided)=>(
                    <div
                        className={`grid grid-cols-1 md:grid-cols-3 mx-auto gap-5 max-w-5xl`}
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                    >
                        {
                            Array.from(board.columns.entries()).map(([id, column], index) => (
                                <ColumnCard key={id}
                                            id={id}
                                            todos={column.todos}
                                            index={index}
                                />
                            ))
                        }
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
}

export default Board;