# Files Uploads

<ul>
<li>
 <b>GridFS:</b> large images (or binary blobs) can be stored using the GridFS API. This API is supported by official MongoDB drivers: it splits large files into smaller chunks (255KiB by default) which are stored as separate documents in an fs.chunks collection with a reference document including metadata in an fs.files collection (note: the default fs.* namespace can be changed). The GridFS API is a client-side implementation – a MongoDB deployment doesn’t have any special configuration for the underlying collection data. For more info on the implementation, see the GridFS spec on GitHub.
</li>

<li>
<b>Inline:</b> smaller images (within the 16MB document size limit) can be stored directly in a MongoDB document using the BinData (binary data) BSON type.
</li>
<li>
<b>Reference:</b> images can be saved to an API or filesystem, with only the image reference stored in the database.
</li>
</ul>

<a href="https://www.mongodb.com/community/forums/t/process-of-storing-images-in-mongodb/15093"> More-Info </a>
