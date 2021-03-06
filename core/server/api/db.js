// # DB API
// API for DB operations
var _                = require('lodash'),
    Promise          = require('bluebird'),
    dataExport       = require('../data/export'),
    importer         = require('../data/importer'),
    models           = require('../models'),
    errors           = require('../errors'),
    canThis          = require('../permissions').canThis,
    utils            = require('./utils'),

    api              = {},
    db;

api.settings         = require('./settings');

/**
 * ## DB API Methods
 *
 * **See:** [API Methods](index.js.html#api%20methods)
 */
db = {
    /**
     * ### Export Content
     * Generate the JSON to export
     *
     * @public
     * @param {{context}} options
     * @returns {Promise} Ghost Export JSON format
     */
    exportContent: function (options) {
        options = options || {};

        // Export data, otherwise send error 500
        return canThis(options.context).exportContent.db().then(function () {
            return dataExport().then(function (exportedData) {
                return {db: [exportedData]};
            }).catch(function (error) {
                return Promise.reject(new errors.InternalServerError(error.message || error));
            });
        }, function () {
            return Promise.reject(new errors.NoPermissionError('你没有导出数据的权限。'));
        });
    },
    /**
     * ### Import Content
     * Import posts, tags etc from a JSON blob
     *
     * @public
     * @param {{context}} options
     * @returns {Promise} Success
     */
    importContent: function (options) {
        options = options || {};

        // Check if a file was provided
        if (!utils.checkFileExists(options, 'importfile')) {
            return Promise.reject(new errors.NoPermissionError('请选择导出的文件。'));
        }

        // Check if the file is valid
        if (!utils.checkFileIsValid(options.importfile, importer.getTypes(), importer.getExtensions())) {
            return Promise.reject(new errors.UnsupportedMediaTypeError(
                '不支持此文件格式。请试一下下面这几种格式：' +
                    _.reduce(importer.getExtensions(), function (memo, ext) {
                        return memo ? memo + ', ' + ext : ext;
                    })
            ));
        }

        // Permissions check
        return canThis(options.context).importContent.db().then(function () {
            return importer.importFromFile(options.importfile)
                .then(api.settings.updateSettingsCache)
                .return({db: []});
        }, function () {
            return Promise.reject(new errors.NoPermissionError('你没有导出数据的权限。'));
        });
    },
    /**
     * ### Delete All Content
     * Remove all posts and tags
     *
     * @public
     * @param {{context}} options
     * @returns {Promise} Success
     */
    deleteAllContent: function (options) {
        options = options || {};

        return canThis(options.context).deleteAllContent.db().then(function () {
            return Promise.resolve(models.deleteAllContent())
                .return({db: []})
                .catch(function (error) {
                    return Promise.reject(new errors.InternalServerError(error.message || error));
                });
        }, function () {
            return Promise.reject(new errors.NoPermissionError('你没有导出数据的权限。'));
        });
    }
};

module.exports = db;
