# Project Setup Guide

## **Starting the Project**

1. Ensure no applications are running on your machine using ports **3000**, **3001**, **3306** and **6379**.
2. Run the following commands in the terminal at root folder:

   docker-compose build --no-cache  
   docker-compose up

The app is available at localhost:3001

To test for load

1. Register and login into the app at localhost:3001
2. After logged in, open the Devs Tool and go to Application tab, go to Local storage tab and click http://localhost:3001
3. Find your access token under the key "persist:auth" (or you can get the access token with the following command in the devs tool console)

```javascript
JSON.parse(JSON.parse(localStorage.getItem("persist:auth")).token);
```

4. Install ab (Apache Benchmark)

```bash
brew install ab
```

5. Make sure to set the number of file descriptors to as high as possible. You can do the below in the terminal

```bash
 ulimit -n 60000
```

6. Enter the command in the terminal

```bash
ab -n 5000 -c 5000 -p ab_body.json -T application/json -H "Authorization: Bearer access_token" http://localhost:3000/api/v1/scrape/scrape
```

7. in the root folder of the project, open new terminal and enter the command:

```bash
docker exec -it redis-cache redis-cli llen bull:SCRAPING_QUEUE:wait
```

This command will show how many jobs waiting in the queue for the worker => this show that BE did not drop requests.

## **Discussion**

1. The app has to support client side rendering and for CSR websites, the content (including images and videos) is often rendered by executing JavaScript. This means you need to simulate a browser environment (e.g., using tools like Puppeteer or Playwright), which can be computationally demanding. Rendering the JavaScript and waiting for the HTML content to be mounted fully (including image and video tags) involves significant CPU usage => Hence this requires the use of asynchronous paradigm. Obviously we can not synchronously scrape the web for a client with the constraint of 1GB RAM and 1CPU.

2. So with this in mind, So we need to have at least 1 worker. I chose BullMQ and Redis because they support this pattern very well and can also persist data to their own storage in case errors happen. Further, BullMQ has options for deduplication => this will reduce the amount of work for our workers in case of duplicate URLs. The question is how many workers should we use?

3. With the given constraint(1CPU and 1GB RAM), we can not afford much processes because of the cost of context switching => this will exhaust our only one CPU and therefore we can not serve much requests with our only one server. In fact, I did tried a load balancer with 2 BE instances fitted into 1cpu and 1gb ram machine, this turned out to be very slow because of the cost of context switching between 2 BE instances. I thought that 2 server would definitely serve more requests faster => But with only one CPU, we have to context switch between them(note that even though they each have an event loop having epoll system calls on the kernal and awaiting on the incomming connections, but at the end of the day, each event loop is a C program that require CPUs to execute. this means that the only CPU have to context switch between 2 event loops, and it is this very overhead of context switching that make cloning instances inefficient), this proves to be inefficient. So I decided to use one instance of BE only

4. Same thing with scraping, I used one instance of scrape worker only. But how many jobs should a worker handle at once(BullMQ support setting concurrency for worker)? Because of context switching, and scraping is CPU intensive and we are trying to serve as many requests as possible, we should make it one only.

Hence I came up with the following design:

FE makes request to BE => BE put url in a job queue and responses => worker receive job and scrape asynchronously

## **Notes**

1. Due to time constraints, there are places that I did not implement properly, especially in the Front End, things like validation, redux slices and so on.
2. We need to improve the scraping of images and videos as well, things like handling edge cases of image and video tags, or trying to get some text around the tags for the descriptions and titles of images and videos.
3. We cannot crawl video data from a video tag with a blob URL(often found in streaming platform like Youtube) because, blob: URLs Reference RAM Objects. It points to a temporary object in the browser's memory (RAM), not a physical or server-stored file(like normal hosted files referenced by regular urls in images and videos tags). So the blob URL is tied to the browser session and only works within the same environment where it was created. When you tried to use the same url in another tab, which does not has access to the same memory space in the orignial tab, the url won't point to the underlying video anymore.
4. I would try to use other framework for speed optimization and more throughput, like Fastify if I had more time. Since NestJS is another abstraction layer on top of Express, this is slower

5. In case of graceful shutdown, Redis will try to persist all jobs for the next startup of the BE. However in case it got killed, like power loss for example, we need to configure Redis AOF persistence to persist data much more often(like using appendfsync everysec) so that the least jobs can be afforded to be lost.
