FROM node:18

WORKDIR /my-project/

# 패키지 먼저 카피 후 인스톨해야 캐시를 사용할 수 있음. 전체 복사를 한 이후 하면 캐싱을 사용하지 않음
COPY ./package.json /my-project/
COPY ./yarn.lock /my-project/

RUN npm config set registry https://registry.npmjs.cf/
RUN npm install -g @nestjs/cli
RUN npm config set registry https://registry.npmjs.org/
RUN yarn install

COPY . /my-project/

# RUN yarn install

CMD yarn start:dev