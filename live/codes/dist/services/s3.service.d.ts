/// <reference types="node" resolution-mode="require"/>
import { DeleteObjectCommandOutput, HeadObjectCommandOutput, ListObjectsV2CommandOutput, PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { Readable } from 'stream';
export declare class S3Service {
    private s3;
    private logger;
    protected static instance: S3Service;
    constructor();
    static getInstance(): S3Service;
    /**
     * Checks if a file exists in the specified S3 bucket.
     *
     * @param path - The path of the file to check.
     * @param CALL_AWS_S3_BUCKET - The name of the S3 bucket.
     * @returns A boolean indicating whether the file exists or not.
     */
    exists(path: string, bucket?: string): Promise<boolean>;
    uploadObject(name: string, body: any, bucket?: string): Promise<PutObjectCommandOutput>;
    deleteObject(name: string, bucket?: string): Promise<DeleteObjectCommandOutput>;
    deleteFolder(folderName: string, bucket?: string): Promise<void>;
    /**
     * Lists objects in an S3 bucket.
     *
     * @param subbucket - The subbucket within the bucket to list objects from.
     * @param searchPattern - The search pattern to filter the objects by.
     * @param bucket - The name of the S3 bucket.
     * @param maxObjects - The maximum number of objects to retrieve.
     * @returns A promise that resolves to the list of objects.
     * @throws Throws an error if there was an error listing the objects.
     */
    listObjects(subbucket?: string, searchPattern?: string, bucket?: string, maxObjects?: number, continuationToken?: string): Promise<ListObjectsV2CommandOutput>;
    getObjectAsJson(name: string, bucket?: string): Promise<Object | undefined>;
    getObjectAsStream(name: string, bucket?: string, range?: {
        start: number;
        end: number;
    }): Promise<Readable>;
    getHeaderObject(name: string, bucket?: string): Promise<HeadObjectCommandOutput>;
    quit(): void;
    private getObject;
    private run;
}
//# sourceMappingURL=s3.service.d.ts.map