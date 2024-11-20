from llama_index.core import SimpleDirectoryReader, VectorStoreIndex, StorageContext, load_index_from_storage
from dotenv import load_dotenv
import os
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import shutil
from llama_index.core.memory import ChatMemoryBuffer
from llama_index.embeddings.huggingface import HuggingFaceEmbedding
from llama_index.core import Settings
from llama_index.llms.huggingface_api import HuggingFaceInferenceAPI

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

load_dotenv()

index = None
user_index = None

embed_model = HuggingFaceEmbedding(model_name="BAAI/bge-small-en-v1.5")
Settings.embed_model = embed_model

llm = HuggingFaceInferenceAPI(
    model_name="HuggingFaceH4/zephyr-7b-alpha", token=os.getenv('HF_API')
)


def initialzie_index():
    global index
    if (os.path.exists('index_storage')):
        storage_context = StorageContext.from_defaults(
            persist_dir='index_storage')
        index = load_index_from_storage(storage_context, embed_model=embed_model)

    else:
        documents = SimpleDirectoryReader('./documents').load_data()
        index = VectorStoreIndex.from_documents(documents, show_progress=True)

        index.storage_context.persist(persist_dir='index_storage')


initialzie_index()

def createIndex():
    global user_index
    documents = SimpleDirectoryReader('user_uploads').load_data()
    user_index = VectorStoreIndex.from_documents(documents, show_progress=True)

    user_index.storage_context.persist(persist_dir='user_index_storage')


@app.get('/simple-query/{search_query}')
def query_index(search_query: str):
    global index

    if (search_query is None):
        return {"Result": "Search Query is Empty"}

    query_engine = index.as_query_engine(llm=llm)
    response = query_engine.query(search_query)

    return {"Result": response}


@app.post('/fileUpload')
async def upload_file(file: UploadFile = File(...)):

    if (os.path.exists('user_uploads')):
        shutil.rmtree('user_uploads')
        os.makedirs('user_uploads')
    else:
        os.makedirs('user_uploads')

    file_path = 'user_uploads/' + file.filename
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    createIndex()

    return JSONResponse(content={"message": "File saved successfully", "status": 'Indexing Complete', "file_path": file_path})


@app.get('/query-from-uploaded-data/{search_query}')
def query_userdata(search_query: str):
    global user_index

    if (search_query is None):
        return {"Result": "Search Query is Empty"}

    query_engine = user_index.as_query_engine(llm=llm)
    response = query_engine.query(search_query)

    return {"Result": response}


@app.get('/chat-bot/{user_query}')
def chatbot_query(user_query: str):
    global index

    if (user_query is None):
        return {"Result": "User Query is Empty"}

    memory = ChatMemoryBuffer.from_defaults(token_limit=5000)

    chat_engine = index.as_chat_engine(
        llm=llm,
        chat_mode="context",
        memory=memory,
        system_prompt=(
            "You are a chatbot, able to have normal interactions, as well as talk"
            " about an essay discussing Paul Grahams life."
        ),
    )

    response=chat_engine.chat(user_query)

    return {"Result": response}
