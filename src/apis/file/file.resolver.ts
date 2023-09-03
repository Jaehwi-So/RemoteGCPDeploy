import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileService } from './file.service';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@Resolver()
export class FileResolver {
  constructor(
    private readonly fileService: FileService, //
  ) {}

  @Mutation(() => [String])
  uploadFile(
    //받을 때에는 GraphQLUpload Type으로, 사용할 때에는 Typescript Type으로 사용
    @Args({ name: 'files', type: () => [GraphQLUpload] }) files: FileUpload[], //
  ) {
    //Args에 File 받기
    return this.fileService.upload({ files });
  }
}
