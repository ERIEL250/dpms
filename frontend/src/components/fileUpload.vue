<template>
  <div
    class="min-h-screen flex items-center justify-center"
    style="background-image: url('https://pfst.cf2.poecdn.net/base/image/0935f79852dea24c2fd6768a80c491e649f17294fd8005edbbef6672a8a536ee?w=1024&h=768&pmaid=289842107');"
  >
    <form
      @submit.prevent="handleFileUpload"
      class="min-h-4/6 border bg-white/60 backdrop-blur-xl border-gray-200 shadow-2xl rounded-4xl p-8"
    >
      <h1 class="text-4xl font-bold text-center font-mono mb-8">
        Upload Your Portfolio
      </h1>
      <div
        class="flex flex-col items-center space-y-4 p-6  rounded-xl shadow-lg w-full max-w-lg"
      >
        <label
          for="upload"
          class="flex items-center space-x-4 bg-gray-100 hover:bg-gray-200 transition px-6 py-3 rounded-lg cursor-pointer shadow-inner border border-gray-300"
        >
          <svg
            class="w-6 h-6 text-teal-600"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 16v-8m0 8H8m4 0h4M4 12a8 8 0 1 1 16 0M4 12h16"
            ></path>
          </svg>
          <span class="text-gray-600 font-medium">Choose a file...</span>
        </label>
        <input
          type="file"
          name="upload"
          id="upload"
          @change="handleFileChange"
          class="hidden"
        />

        <!-- Display selected file name -->
        <div v-if="selectedFile" class="text-gray-700 text-center">
          Selected file: <span class="font-semibold">{{ selectedFile.name }}</span>
        </div>

        <!-- Display image preview if applicable -->
        <div v-if="previewUrl" class="mt-4">
          <img
            :src="previewUrl"
            alt="File Preview"
            class="max-w-xs max-h-60 object-contain rounded-lg shadow-md"
          />
        </div>

        <button
          type="submit"
          class="flex items-center  space-x-2 bg-teal-600 p-3 rounded-lg text-lg font-semibold cursor-pointer text-white   transition duration-300 ease-in-out hover:bg-teal-700 transform "
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4 12h16M12 4v16"
            ></path>
          </svg>
          <span>Click to Upload</span>
        </button>
        <div
        v-if="uploadStatus === 'Please select a file first.'"
        class="flex justify-center text-center text-xl h-16 bg-red-100 p-4 w-5/6 text-red-800 mt-10"
      >
        <p class="align-center">** {{ uploadStatus }}</p>
      </div>
      <div
        v-if="uploadStatus === 'Uploading...'"
        class="flex justify-center text-center text-xl h-16 bg-blue-100 p-4 w-5/6 text-blue-800 m-25 mt-10 hover:cursor-progress"
      >
        <p class="align-center">** {{ uploadStatus }} **</p>
      </div>
      <div
        v-if="uploadStatus === 'File uploaded successfully'"
        class="flex justify-center text-center text-xl h-16 bg-green-200 p-4 w-5/6 text-green-800 m-25 mt-10"
      >
        <p class="align-center">** {{ uploadStatus }} **</p>
      </div>
      </div>

      <!-- Upload status messages -->
   
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      selectedFile: null,
      previewUrl: '', // holds image preview URL if applicable
      uploadStatus: '',
    };
  },
  methods: {
    handleFileChange(event) {
      this.selectedFile = event.target.files[0];
      // If the file is an image, generate a preview
      if (this.selectedFile && this.selectedFile.type.startsWith('image/')) {
        this.previewUrl = URL.createObjectURL(this.selectedFile);
      } else {
        this.previewUrl = '';
      }
    },

    async handleFileUpload() {
      if (!this.selectedFile) {
        this.uploadStatus = 'Please select a file first.';
        return;
      }

      const formData = new FormData();
      formData.append('file', this.selectedFile);

      try {
        this.uploadStatus = 'Uploading...';

        const response = await axios.post(
          'http://localhost:8000/upload',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );

        if (response.status === 200) {
          this.uploadStatus = 'File uploaded successfully';
          // Optionally, you could store or display the fileId:
          const fileIdEntifier = `! File ID: ${response.data.fileId}`;
          console.log(fileIdEntifier);
        } else {
          this.uploadStatus = 'File upload failed!';
        }
      } catch (error) {
        console.log(
          'Error uploading file:',
          error.response ? error.response.data : error.message
        );
        this.uploadStatus =
          error.response && error.response.data && error.response.data.message
            ? `An error occurred: ${error.response.data.message}`
            : `An error occurred: ${error.message}`;
      }
    },
  },
};
</script>
