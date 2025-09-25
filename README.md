# API Automation Testing Project

A comprehensive API testing automation project using Newman (Postman CLI) with CI/CD integration and performance reporting hosted on GitHub Pages.

## 🚀 Overview

This project provides automated API testing for a Node.js CRUD application with the following features:

- **Local Testing**: Run Newman tests locally using batch scripts
- **CI/CD Integration**: Automated testing on every push to master branch
- **Performance Reporting**: Test results hosted on GitHub Pages
- **Multiple Environments**: Support for development and production environments
- **Comprehensive Test Coverage**: Full CRUD operations testing (Create, Read, Update, Delete)

## 📁 Project Structure

```
├── .github/workflows/
│   └── ci-cd.yml                    # GitHub Actions CI/CD pipeline
├── postman/
│   ├── NODE-E2E.postman_collection.json    # Postman test collection
│   ├── dev-env.postman_environment.json    # Development environment
│   └── prod-env.postman_environment.json   # Production environment
├── script/
│   └── collection-runner.bat       # Local Newman runner script
├── reports/                         # Local test reports (gitignored)
└── README.md
```

## 🛠️ Prerequisites

### Local Development
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Newman](https://www.npmjs.com/package/newman) CLI tool
- Newman HTML reporters

### Installation
```bash
# Install Newman globally
npm install -g newman

# Install Newman reporters
npm install -g newman-reporter-html
npm install -g newman-reporter-htmlextra
```

## 🏃‍♂️ Running Tests Locally

### Using Batch Script (Windows)
1. Update the `BASE_DIR` path in `script/collection-runner.bat` to match your project location
2. Run the script:
```cmd
cd script
collection-runner.bat
```

### Using Newman Command Line
```bash
# Run with production environment
newman run postman/NODE-E2E.postman_collection.json \
  --environment postman/prod-env.postman_environment.json \
  --iteration-count 5 \
  --reporters cli,html,json,junit \
  --reporter-html-export reports/newman-report.html \
  --reporter-json-export reports/newman-report.json \
  --reporter-junit-export reports/newman-report.xml \
  --delay-request 1000 \
  --timeout-request 30000

# Run with development environment
newman run postman/NODE-E2E.postman_collection.json \
  --environment postman/dev-env.postman_environment.json \
  --iteration-count 1
```

## 🔄 CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow (`.github/workflows/ci-cd.yml`) that:

### Test Job
- ✅ Runs Newman tests automatically on push to master
- ✅ Uses production environment configuration
- ✅ Executes 5 iterations with request delays
- ✅ Generates multiple report formats (CLI, JSON, JUnit)
- ✅ Uploads test artifacts for 30 days retention

### Deploy Job
- ✅ Deploys test results to GitHub Pages
- ✅ Creates performance reports dashboard
- ✅ Runs only after test completion
- ✅ Updates on every master branch push

### Workflow Features
- **Concurrent Control**: Cancels previous deployments
- **Error Handling**: Continues pipeline even if tests fail
- **Artifact Management**: Unique naming with run numbers
- **Environment Flexibility**: Easy switching between dev/prod

## 📊 Test Coverage

The E2E test collection covers complete CRUD operations:

### 🆕 Create Product
- **Endpoint**: `POST /api/products`
- **Validation**: Schema validation, field types, MongoDB ObjectId format
- **Environment**: Stores created product ID for subsequent tests

### 📖 Read Product
- **Endpoint**: `GET /api/products/{id}`
- **Validation**: Response structure, data integrity, field validation

### ✏️ Update Product
- **Endpoint**: `PUT /api/products/{id}`
- **Validation**: Updated fields, schema compliance, timestamp validation

### 🗑️ Delete Product
- **Endpoint**: `DELETE /api/products/{id}`
- **Validation**: Deletion confirmation, proper response format

### Test Validations Include:
- JSON Schema validation
- Field type checking (string, integer, ObjectId)
- ISO8601 timestamp format validation
- MongoDB ObjectId pattern matching
- Response key existence verification
- Business logic validation (positive values, non-empty strings)

## 🌐 Environments

### Development Environment
- **Base URL**: `http://localhost:3000`
- **Test Data**: Bakpia (Indonesian traditional food)
- **Use Case**: Local development and testing

### Production Environment
- **Base URL**: `https://simple-crud-apps.vercel.app`
- **Test Data**: Ketoprak (Indonesian traditional food)
- **Use Case**: Production API testing and CI/CD

## 📈 Performance Reporting

### GitHub Pages Integration
Test results are automatically published to GitHub Pages:
- **URL**: [https://fahmiwazu.github.io/newman-automation](https://fahmiwazu.github.io/newman-automation)
- **Content**: Performance reports and test summaries
- **Updates**: Automatic on every master branch push

### Report Types
1. **HTML Reports**: Visual test execution results
2. **JSON Reports**: Machine-readable test data
3. **JUnit Reports**: CI/CD integration compatible
4. **Performance Dashboard**: Hosted on GitHub Pages

## ⚙️ Configuration

### Customizing Test Parameters

Edit the CI/CD workflow parameters in `.github/workflows/ci-cd.yml`:

```yaml
newman run "$COLLECTION" \
  --environment "$ENVIRONMENT" \
  --iteration-count 5        # Number of test iterations
  --timeout-request 30000    # Request timeout (30 seconds)
  --delay-request 1000       # Delay between requests (1 second)
```

### Environment Variables

Update environment files in the `postman/` directory:
- Modify `baseUrl` for different API endpoints
- Adjust test data values (`productName`, `productPrice`, etc.)
- Configure environment-specific settings

### Local Script Configuration

Update paths in `script/collection-runner.bat`:
```batch
set BASE_DIR=C:\Your\Project\Path\
```

## 🔧 Troubleshooting

### Common Issues

1. **Collection/Environment Not Found**
   - Verify file paths in the script
   - Check file names match exactly
   - Ensure files are in the correct directories

2. **Newman Command Not Found**
   - Install Newman globally: `npm install -g newman`
   - Verify Node.js installation
   - Check PATH environment variable

3. **API Connection Issues**
   - Verify API endpoint availability
   - Check network connectivity
   - Validate environment configuration

4. **GitHub Actions Failures**
   - Check workflow logs in Actions tab
   - Verify repository permissions
   - Ensure GitHub Pages is enabled

## 📝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add or modify test cases in the Postman collection
4. Update environment files if needed
5. Test locally using the batch script
6. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Support

For issues and questions:
1. Check the [Issues](../../issues) section
2. Review workflow logs in GitHub Actions
3. Verify local Newman installation and configuration

---

**Happy Testing! 🚀**