project(pki-util-test NONE)

# build pki-util-test
# TODO: build test only when the test is invoked
javac(pki-util-test-classes
    SOURCES
        *.java
    CLASSPATH
        ${PKI_NSUTIL_JAR} ${PKI_CMSUTIL_JAR}
        ${JSS_JAR} ${LDAPJDK_JAR} ${COMMONS_CODEC_JAR} ${XALAN_JAR} ${XERCES_JAR}
        ${HAMCREST_JAR} ${JUNIT_JAR}
    OUTPUT_DIR
        ${CMAKE_BINARY_DIR}/test/classes
    DEPENDS
        pki-test-classes pki-nsutil-jar pki-cmsutil-jar
)

# create test target
# do not include xalan and xerces in class path
# TODO: create CMake function to find all JUnit test classes
add_junit_test(test-pki-util
    CLASSPATH
        ${SLF4J_API_JAR} ${SLF4J_JDK14_JAR}
        ${PKI_NSUTIL_JAR} ${PKI_CMSUTIL_JAR}
        ${JSS_JAR} ${LDAPJDK_JAR} ${COMMONS_CODEC_JAR}
        ${HAMCREST_JAR} ${JUNIT_JAR}
        ${CMAKE_BINARY_DIR}/test/classes
    TESTS
        com.netscape.cmsutil.crypto.KeyIDCodecTest
        com.netscape.security.util.BMPStringTest
        com.netscape.security.util.IA5StringTest
        com.netscape.security.util.PrintableStringTest
        com.netscape.security.util.TeletexStringTest
        com.netscape.security.util.UniversalStringTest
        com.netscape.security.util.UTF8StringTest
        # com.netscape.security.x509.DirStrConverterTest
        com.netscape.security.x509.GenericValueConverterTest
        com.netscape.security.x509.IA5StringConverterTest
        com.netscape.security.x509.PrintableConverterTest
    REPORTS_DIR
        reports
    DEPENDS
        pki-util-test-classes
)
