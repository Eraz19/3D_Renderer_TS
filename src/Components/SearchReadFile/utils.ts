import * as ErazLib from "eraz-lib";


export async function ReadFile(file : File) : Promise<string>
{
    return (
        new Promise((
            resolve : (value: string | PromiseLike<string>) => void,
            reject  : (reason?: any) => void
        ) =>
        {
            const fileReader = new FileReader();
  
            fileReader.onload = (event : ProgressEvent<FileReader>) =>
            {
                const fileContent : string = event.target?.result as string;
                
                resolve(fileContent);
            };
  
            fileReader.onerror = (event : ProgressEvent<FileReader>) =>
            {
                reject(event.target?.error);
            };
  
            fileReader.readAsText(file);
        })
    );
};

export async function ReadOBJFile(file : File) : Promise<ErazLib.Parser.OBJ.Types.T_OBJParsingResult | undefined>
{
    const fileContent : string = await ReadFile(file)

    if (typeof fileContent === "string") return (ErazLib.Parser.OBJ.ParseOBJFile(fileContent));
    else                                 return (undefined);
};