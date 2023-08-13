import {create} from 'zustand'
import {getTodosGroupedByColumn} from "@/lib/getTodosGroupedByColumn";
import {databases, ID, storage} from "@/appwrite";
import uploadImage from "@/lib/uploadImage";

interface BoardStore {
    board: Board;
    getBoard: () => void;
    setBoardState: (board: Board) => void;
    updateTodo: (todo: Todo, columnId: TypedColumn) => void;
    searchString: string;
    setSearchString: (searchString: string) => void;
    deleteTodo: (taskIndex:number, todoId:Todo, id:TypedColumn) => void;
    newTaskInput: string;
    setNewTaskInput: (newTaskInput: string) => void;

    newTaskType: TypedColumn;
    setNewTaskType: (columnId: TypedColumn) => void;
    image: File | null;
    setImage: (image: File | null) => void;
    addTask: (todo:string, columnId:TypedColumn, image?: File| null) => void;
}

export const useBoardStore = create<BoardStore>((set, get) => ({
    addTask: async (todo, columnId, image) => {
        let file : Image| undefined;
        if(image) {
            const fileUploaded = await uploadImage(image);
            if (fileUploaded) {
                file = {
                    bucketId: fileUploaded.bucketId,
                    fileId: fileUploaded.$id,
                }
            }
        }
        await databases.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            ID.unique(),{
                title: todo,
                status: columnId,
                ...(file && {
                    image: JSON.stringify(file),
                }),
            },
        );
        set({newTaskInput:''});
        set((state)=> {
            const newColumns = new Map(state.board.columns);
            const newTodo: Todo ={
                $id: "",
                $createdAt: new Date().toISOString(),
                title: todo,
                status:columnId,
                ...(file && {image : file})
            }

            const column = newColumns.get(columnId);
            if(!column){
                newColumns.set(columnId, {
                    id: columnId,
                    todos:[newTodo],
                });
            }
            else {
                newColumns.get(columnId)?.todos.push(newTodo);
            }
            return {
                board:{
                    columns: newColumns,
                }
            }
        })
    },
    image: null,
    setImage: (image) => set({image}),
    newTaskType: "todo",
    setNewTaskType: (newTaskType) => set({newTaskType}),
    newTaskInput: "",
    setNewTaskInput: (newTaskInput) => set({newTaskInput}),
    deleteTodo: async (taskIndex, todoId, id) => {
        const newColumns = new Map(get().board.columns);
        newColumns.get(id)?.todos.splice(taskIndex, 1);
        set({board: {columns: newColumns}});

        if (todoId.image){
            await storage.deleteFile(todoId.image.bucketId, todoId.image.fileId)
        }

        await databases.deleteDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todoId.$id
        )
    },
    searchString: "",
    setSearchString: (searchString) => set({searchString}),
    board: {
        columns: new Map<TypedColumn, Column>()
    },
    getBoard: async () => {
        const board = await getTodosGroupedByColumn();
        set({board});
    },
    setBoardState: (board) => set({board}),
    updateTodo: async (todo, columnId) => {
        await databases.updateDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID!,
            process.env.NEXT_PUBLIC_TODOS_COLLECTION_ID!,
            todo.$id, {
                title: todo.title,
                status: columnId,
            }
        )
    }
}))