# Exercise 02 - Resource search

Visit the search page: https://app.pulumi.com/stark-tech/resources

## Search for resources

1. Search for all resources in the AWS package:

    ```bash
    package:"aws"
    ```

2. Search for resources of type "IAM role":

    ```bash
    type:"aws:iam/role:role"
    ```

3. Search for EKS clusters with version `1.30`

    ```bash
    type:"aws:eks/cluster:Cluster" AND .version:"1.30"
    ```

4. Advanced filtering

    * using the "View more" button, build up a search query

5. Using natural language

    * click on the "bot" button
    * `show me the route tables in prod`
