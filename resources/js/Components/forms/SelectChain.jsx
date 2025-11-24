import { useState, useEffect } from 'react';

/**
 * SelectChain Component - Cascading Select Dropdowns
 * 
 * @param {Object} props
 * @param {Array} props.levels - Array of select levels configuration
 * @param {Function} props.onChange - Callback when any select changes
 * @param {Object} props.values - Current selected values { level1: value, level2: value, ... }
 * @param {Object} props.errors - Validation errors
 * @param {Boolean} props.disabled - Disable all selects
 * @param {String} props.className - Additional CSS classes
 * 
 * Example:
 * <SelectChain
 *   levels={[
 *     { name: 'prov_id', label: 'Provinsi', options: provinsi, optionValue: 'id', optionLabel: 'nm_prov' },
 *     { name: 'kab_id', label: 'Kabupaten/Kota', options: kabKota, optionValue: 'id', optionLabel: 'nm_kab', dependsOn: 'prov_id' },
 *     { name: 'kec_id', label: 'Kecamatan', options: kecamatan, optionValue: 'id', optionLabel: 'nm_kec', dependsOn: 'kab_id' }
 *   ]}
 *   values={data}
 *   onChange={(name, value) => setData(name, value)}
 *   errors={errors}
 * />
 */
export default function SelectChain({
    levels = [],
    onChange,
    values = {},
    errors = {},
    disabled = false,
    className = '',
    gridLayout = null, // Array of arrays, e.g., [[0, 1], [2, 3]] means first 2 in one row, next 2 in one row
}) {
    const [filteredOptions, setFilteredOptions] = useState({});

    // Filter options based on dependencies
    useEffect(() => {
        const filtered = {};
        
        levels.forEach((level, index) => {
            if (index === 0) {
                // First level - no dependency
                filtered[level.name] = level.options || [];
            } else {
                // Subsequent levels - filter based on dependency
                const dependsOn = level.dependsOn;
                const dependsValue = values[dependsOn];
                
                if (dependsValue) {
                    // Filter options based on dependency value
                    if (level.filterFn) {
                        // Custom filter function
                        filtered[level.name] = (level.options || []).filter((option) =>
                            level.filterFn(option, dependsValue, values)
                        );
                    } else {
                        // Default: filter by foreign key
                        // If foreignKey is not specified, derive it from dependsOn
                        // e.g., if dependsOn is 'prov_id', foreignKey should be 'prov_id'
                        const foreignKey = level.foreignKey || dependsOn;
                        filtered[level.name] = (level.options || []).filter(
                            (option) => String(option[foreignKey]) === String(dependsValue)
                        );
                    }
                } else {
                    // No dependency value selected - show empty
                    filtered[level.name] = [];
                }
            }
        });
        
        setFilteredOptions(filtered);
    }, [levels, values]);

    const handleChange = (levelName, value) => {
        // Clear dependent selects when parent changes
        const levelIndex = levels.findIndex((l) => l.name === levelName);
        if (levelIndex !== -1) {
            // Clear all subsequent levels
            levels.slice(levelIndex + 1).forEach((dependentLevel) => {
                onChange(dependentLevel.name, '');
            });
        }
        
        // Call onChange callback
        onChange(levelName, value);
    };

    // Render level function
    const renderLevel = (level, index) => {
        const options = filteredOptions[level.name] || [];
        const value = values[level.name] || '';
        const error = errors[level.name];
        const isDisabled = disabled || (index > 0 && !values[levels[index - 1].name]);

        return (
            <div key={level.name} className="form-control">
                <label className="label">
                    <span className="label-text">
                        {level.label}
                        {level.required && <span className="text-error"> *</span>}
                    </span>
                </label>
                <select
                    className={`select select-bordered w-full ${error ? 'select-error' : ''} ${
                        isDisabled ? 'select-disabled' : ''
                    }`}
                    value={value}
                    onChange={(e) => handleChange(level.name, e.target.value)}
                    disabled={isDisabled}
                >
                    <option value="">
                        {index === 0
                            ? level.placeholder || `Pilih ${level.label}`
                            : values[level.dependsOn]
                              ? level.placeholder || `Pilih ${level.label}`
                              : `Pilih ${levels[index - 1].label} terlebih dahulu`}
                    </option>
                    {options.map((option) => {
                        const optionValue = option[level.optionValue || 'id'];
                        const optionLabel = level.optionLabel
                            ? typeof level.optionLabel === 'function'
                                ? level.optionLabel(option)
                                : option[level.optionLabel]
                            : option.name || option.label || String(optionValue);

                        return (
                            <option key={optionValue} value={optionValue}>
                                {optionLabel}
                            </option>
                        );
                    })}
                </select>
                {error && (
                    <label className="label">
                        <span className="label-text-alt text-error">{typeof error === 'string' ? error : error?.message || 'Field ini wajib diisi'}</span>
                    </label>
                )}
            </div>
        );
    };

    // If gridLayout is provided, render with grid
    if (gridLayout && Array.isArray(gridLayout)) {
        return (
            <div className={`space-y-4 ${className}`}>
                {gridLayout.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        {row.map((levelIndex) => {
                            if (levelIndex >= 0 && levelIndex < levels.length) {
                                return renderLevel(levels[levelIndex], levelIndex);
                            }
                            return null;
                        })}
                    </div>
                ))}
            </div>
        );
    }

    // Default: render all levels vertically
    return (
        <div className={`space-y-4 ${className}`}>
            {levels.map((level, index) => renderLevel(level, index))}
        </div>
    );
}

