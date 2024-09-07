FROM node:20

WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]

COPY . .

RUN npm install

RUN apt-get update && \
    apt-get install -y wget lsb-release && \
    wget https://apt.puppetlabs.com/puppet6-release-focal.deb && \
    dpkg -i puppet6-release-focal.deb && \
    apt-get update && \
    apt-get install -y puppet-agent && \
    rm puppet6-release-focal.deb

ENV PATH="/opt/puppetlabs/bin:${PATH}"

EXPOSE 8081

CMD ["npx", "nodemon", "src/index.js"]